import { Controller, Get, Redirect, Res, Query, Req, UseInterceptors } from '@nestjs/common';
import { LoginService } from './login.service'
import { getAuthorizeUrl } from '../../discord/helpers'
import { UsersService } from '../../users/users.service';
import { CookiesService } from '../../cookies/cookies.service';
import { GetTokenDto } from './login.validators'
import { CookieInterceptor } from './login.interceptor'
import { RequestWithCookie } from '../../cookies/cookies.service'
import { configService } from 'src/config/config.service';

@Controller()
export class LoginController {
  constructor(
    private loginService: LoginService, 
    private usersService: UsersService, 
    private cookiesService: CookiesService
  ) {}
  
  @Get('login')
  @Redirect(getAuthorizeUrl(configService.getValue('CLIENT_ID')), 301)
  redirectToDiscord() {}


  @Get('login/token')
  @UseInterceptors(CookieInterceptor)
  async discordToken(@Query() query: GetTokenDto, @Req() request: RequestWithCookie) {
    const tokenResponse = await this.loginService.getDiscordToken({
      clientId: configService.getValue('CLIENT_ID'),
      clientSecret: configService.getValue('CLIENT_SECRET'),
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
          httpOnly: true, 
          secure: true,
          sameSite: 'none'
        },
      },
    ], request
    )
  }
}
