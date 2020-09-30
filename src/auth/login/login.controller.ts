import { Controller, Get, Redirect, Res, Query, Req, UseInterceptors } from '@nestjs/common';
import { CLIENT_ID, CLIENT_SECRET } from '../../discord/consts'
import { LoginService } from './login.service'
import { getAuthorizeUrl } from '../../discord/helpers'
import { UsersService } from '../../users/users.service';
import { CookiesService } from '../../cookies/cookies.service';
import { GetTokenDto } from './login.validators'
import { IDiscordUserMappedResponse } from '../../users/users.service'
import jwtSecret from '../../config/jwt.secret'
import { Response, Request } from 'express'
import fetch from 'node-fetch'
import btoa from 'btoa'
import { CookieInterceptor } from './login.interceptor'
import { RequestWithCookie } from '../../cookies/cookies.service'
import { sign } from "jsonwebtoken";

@Controller()
export class LoginController {
  constructor(
    private loginService: LoginService, 
    private usersService: UsersService, 
    private cookiesService: CookiesService
  ) {}
  
  @Get('login')
  @Redirect(getAuthorizeUrl(CLIENT_ID), 301)
  redirectToDiscord() {}


  @Get('login/token')
  @UseInterceptors(CookieInterceptor)
  async discordToken(@Query() query: GetTokenDto, @Req() request: RequestWithCookie) {
    const tokenResponse = await this.loginService.getDiscordToken({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      authorizationCode: query.code
    })
    
    const user = await this.usersService.getDiscordUser(tokenResponse.accessToken)

    const cookie = this.loginService.getJwtToken({ 
      expireTime: tokenResponse.expiresIn,
      payload: {
        userId: user.id,
        discordToken: tokenResponse.accessToken,
      }
    })
  
    this.cookiesService.addCookiesToRequestObject([
      {
        cookie: cookie,
        name: 'Authorization',
        options: { 
          httpOnly: false, 
          secure: false,
        },
      },
    ], request
    )
  }
}
