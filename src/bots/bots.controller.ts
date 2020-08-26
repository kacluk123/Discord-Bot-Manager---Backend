import { Controller, Get, Redirect, Res, Query, Req, UseInterceptors, UseGuards, Post, Body  } from '@nestjs/common';
import { JwtAuthenticationGuard } from '../auth/jwt/jwt.guard'
import { Response, Request } from 'express'
import { CreateBotDto } from './bots.validators'

@Controller()
export class BotsController {
  @UseGuards(JwtAuthenticationGuard)
  @Post('bots/add-bot')
  addBot(@Res() response: Response, @Body() body: CreateBotDto) {
    console.log(body)
    return body
  }
}
