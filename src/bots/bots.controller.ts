import { Controller, Get, Redirect, Res, Query, Req, UseInterceptors, UseGuards  } from '@nestjs/common';
import { JwtAuthenticationGuard } from '../auth/jwt/jwt.guard'
import { Response, Request } from 'express'

@Controller('bots')
export class BotsController {
  
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  test(@Res() response: Response) {
    console.log(response)
    return {
      hello: 'dasdad'
    }
  }
}
