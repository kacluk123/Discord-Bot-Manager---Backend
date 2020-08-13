import { Injectable, HttpService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators' 
import { currentUserURL } from '../discord/apiUrls'

interface IDiscordUserResponse {
  id: string
  username: string
  discriminator: string
  avatar: string
  bot?: boolean
  system?: boolean
  mfa_enabled?: boolean
  locale?: string
  verified?: boolean
  email?: string
  flags?: number
  premium_type?: number
  public_flags?: number
}

export interface IDiscordUserMappedResponse {
  id: string
  username: string
  discriminator: string
  avatar: string
  bot?: boolean
  system?: boolean
  mfaEnabled?: boolean
  locale?: string
  verified?: boolean
  email?: string
  flags?: number
  premiumType?: number
  publicFlags?: number
}

const unpackDiscordUser = (user: IDiscordUserResponse): IDiscordUserMappedResponse => ({
  id: user.id,
  username: user.username,
  discriminator: user.discriminator,
  avatar: user.avatar,
  bot: user.bot,
  system: user.system,
  mfaEnabled: user.mfa_enabled,
  locale: user.locale,
  verified: user.verified,
  email: user.email,
  flags: user.flags,
  premiumType: user.premium_type,
  publicFlags: user.public_flags
})

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly repo: Repository<Users>, 
    private readonly httpService: HttpService
  ) { }

  async getDiscordUser(accessToken: string): Promise<IDiscordUserMappedResponse> {
    const user = this.httpService.get<IDiscordUserResponse>(currentUserURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    return user.pipe(
      map(res => unpackDiscordUser(res.data))
    ).toPromise()
  }

  addUser() {
    this.repo.insert({
      id: 'siema',
      isActive: true,
      data: 'hello dude'
    })
  }
}
