import { Injectable, HttpService } from '@nestjs/common';
import { tokenUrl } from '../../discord/apiUrls'
// import { AxiosResponse } from '@nestjs/common'
import fetch from 'node-fetch'
import { AxiosResponse } from 'axios'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators' 
import  { JwtService } from '@nestjs/jwt'

export interface IDiscordTokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}

export interface IDiscordTokenMappedResponse {
  accessToken: string,
  expiresIn: number,
  refreshToken: string,
  scope: string,
  tokenType: string
}

const unpackDiscordToken = (token: IDiscordTokenResponse): IDiscordTokenMappedResponse => ({
  accessToken: token.access_token,
  expiresIn: token.expires_in,
  refreshToken: token.refresh_token,
  scope: token.scope,
  tokenType: token.token_type
})

@Injectable()
export class LoginService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}
  
  async getDiscordToken({
    authorizationCode,
    clientId,
    clientSecret
  }: {
    authorizationCode: string,
    clientId: string
    clientSecret: string
  }): Promise<IDiscordTokenMappedResponse> {
    const response = this.httpService.post<IDiscordTokenResponse>(
      tokenUrl, 
      `client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&code=${authorizationCode}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin%2Ftoken&scope=connections%20guilds%20messages.read`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    return response.pipe(
      map(resp => unpackDiscordToken(resp.data)),
    ).toPromise();
  }

  public getJwtToken({ expireTime, payload }: {
    expireTime: number
    payload: {
      userId: string,
      discordToken: string
    }
  }) {
    const token = this.jwtService.sign(payload, {
      expiresIn: expireTime
    });
    return token
  }
}
