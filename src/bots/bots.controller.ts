import { Controller, Get, Redirect, Res, Query, Req, UseInterceptors, UseGuards  } from '@nestjs/common';
import { JwtAuthenticationGuard } from '../auth/jwt/jwt.guard'

@Controller('bots')
export class BotsController {
  
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  test() {
    return {
      hello: 'dasdad'
    }
  }
}
