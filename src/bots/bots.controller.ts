import { Controller, Get, Redirect, Res, Query, Req, Param, UseGuards, Post, Body, HttpException  } from '@nestjs/common';
import { JwtAuthenticationGuard } from '../auth/jwt/jwt.guard'
import { Response, Request } from 'express'
import { CreateBotDto } from './bots.validators'
import { BotsService } from './bots.service'
import { RequestWithUser } from '../auth/jwt/jwt.strategy'

export interface ICreateBotBody extends CreateBotDto {
  userId: string
}

@Controller('bots')
export class BotsController {
  constructor(
    private readonly botsService: BotsService,
  ) {}
  
  @UseGuards(JwtAuthenticationGuard)
  @Post('/add-bot')
  async addBot(@Req() request: RequestWithUser, @Body() body: CreateBotDto) {
    const ifBotExist = await this.botsService.checkThatKeyExist(body.token)

    if (ifBotExist) {
      throw new HttpException('Bot with this token already exist', 409)
    } else {
      const createdBot = await this.botsService.addBot({
        ...body,
        userId: request.user.userId
      })
      return createdBot
    }
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('/get-bot/:id')
  async getBot(@Req() request: RequestWithUser, @Param() params) {
    const bot = await this.botsService.getBot(params.id)
    const isUserIdCorrect = bot.userId === request.user.userId

    if (bot && isUserIdCorrect) {
      return bot
    } else {
      throw new HttpException('Bot is not exist', 401)
    }
  }
}
