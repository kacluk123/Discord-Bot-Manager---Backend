import { Controller, Get, Redirect, Res, Query, Req, UseInterceptors, UseGuards, Post, Body, HttpException  } from '@nestjs/common';
import { JwtAuthenticationGuard } from '../auth/jwt/jwt.guard'
import { Response, Request } from 'express'
import { CreateBotDto } from './bots.validators'
import { BotsService } from './bots.service'

@Controller('bots')
export class BotsController {
  constructor(
    private readonly botsService: BotsService,
  ) {}
  
  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async addBot(@Body() body: CreateBotDto) {
    const ifBotExist = await this.botsService.checkThatKeyExist(body.token)
    
    if (ifBotExist) {
      throw new HttpException('Bot with this token already exist', 409)
    } else {
      const createdBot = await this.botsService.addBot(body)
      return createdBot
    }
  }
}
