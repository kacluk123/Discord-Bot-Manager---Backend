import { Controller, Get, Redirect, Res, Query, Req, UseInterceptors } from '@nestjs/common';
import { CLIENT_ID, CLIENT_SECRET } from '../../discord/consts'
import { LoginService } from './login.service'
import { getAuthorizeUrl } from '../../discord/helpers'
import { UsersService } from '../../users/users.service';
import { GetTokenDto } from './login.validators'
import jwtSecret from '../../config/jwt.secret'
import { Response, Request } from 'express'
import fetch from 'node-fetch'
import btoa from 'btoa'
import { CookieInterceptor } from './login.interceptor'
import { sign } from "jsonwebtoken";

interface X extends Request {
  _cookies: string
}

@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService, private usersService: UsersService) {}
  
  @Get()
  @Redirect(getAuthorizeUrl(CLIENT_ID), 301)
  redirectToDiscord() {}


  @Get('token')
  @UseInterceptors(CookieInterceptor)
  async discordToken(@Query() query: GetTokenDto, @Req() request: X) {
    const tokenResponse = await this.loginService.getDiscordToken({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      authorizationCode: query.code
    })
    
    const user = await this.usersService.getDiscordUser(tokenResponse.accessToken)

    const cookie = this.loginService.getCookieWithJwtToken({ 
      expireTime: tokenResponse.expiresIn,
      payload: {
        userId: user.id,
        discordToken: tokenResponse.accessToken,
      }
    })
    request._cookies = cookie
    // response.cookie("token", cookie, { httpOnly: true, secure: false })
    return {
      userId: user.id,
    }
  }
}
