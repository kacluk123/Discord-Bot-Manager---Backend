import { 
  Controller, 
  Get, 
  Param, 
  UseGuards, 
  Post, 
  Body, 
  HttpException, 
  Delete,
  Patch,
  UseInterceptors
} from '@nestjs/common';
import { JwtAuthenticationGuard } from '../auth/jwt/jwt.guard'
import { Response, Request } from 'express'
import { CreateBotDto, EditBotDto } from './bots.validators'
import { BotsService } from './bots.service'
import { RequestWithUser } from '../auth/jwt/jwt.strategy'
import { User } from '../common/decorators/user'
import { IUser} from '../auth/jwt/jwt.strategy'
import AdBot from './botTypes/ad'
import { IAdBotConfig } from './botTypes/ad'
import Bot from './bots.factory'
import { botsContainer } from '../main'
export interface ICreateBotBody extends CreateBotDto {
  userId: string
}

@Controller('bots')
export class BotsController {
  constructor(
    private readonly botsService: BotsService,
  ) {}
  
  @UseGuards(JwtAuthenticationGuard)
  @Post('/bot')
  async addBot(@User() user: IUser, @Body() body: CreateBotDto) {
    const ifBotExist = await this.botsService.checkThatKeyExist(body.token)
    if (ifBotExist) {
      throw new HttpException('Bot with this token already exist', 409)
    } else {
      const createdBot = await this.botsService.addBot({
        ...body,
        userId: user.userId
      })
        
      try {
        botsContainer.addBot(createdBot)

        return createdBot
      } catch (err) {
        throw new HttpException('Token is invalid', 401)
      }
    }
  }
  
  @UseGuards(JwtAuthenticationGuard)
  @Delete('/bot/:id')
  async deleteBot(@User() user: IUser, @Param() params) {
    const bot = await this.botsService.getBot(params.id)
    if (bot) {
      const isUserIdCorrect = bot.userId === user.userId
      if (isUserIdCorrect && bot) {
        try {
          botsContainer.deleteBot(params.id)
          const deleteResponse = await this.botsService.deleteBot(params.id)

          return deleteResponse
        } catch(err) {
          console.log(err)
          return err
        }
      } else {
        throw new HttpException('Bot is not exist', 401)
      }
    } else {
      throw new HttpException('Bot is not exist', 401)
    }
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('/bot/:id')
  async getBot(@User() user: IUser, @Param() params) {
    const bot = await this.botsService.getBot(params.id)
    if (bot) {
      const isUserIdCorrect = bot.userId === user.userId
    
      if (bot && isUserIdCorrect) {
        return bot
      } else {
        throw new HttpException('Bot is not exist', 401)
      }
    } else {
      throw new HttpException('Bot is not exist', 401)
    }
  }


  @UseGuards(JwtAuthenticationGuard)
  @Patch('/bot/:id')
  async editBot(@User() user: IUser, @Param() params, @Body() body: EditBotDto) {
    const originalBot = await this.botsService.getBot(params.id)
    if (originalBot) {
      const isUserIdCorrect = originalBot.userId === user.userId
    
      if (originalBot && isUserIdCorrect) {
        const modifiedBot = await this.botsService.editBot(body, originalBot)
        botsContainer.editBot(modifiedBot)
        return modifiedBot  
      } else {
        throw new HttpException('Bot is not exist', 401)
      }
    } else {
      throw new HttpException('Bot is not exist', 401)
    }
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('/get-bots')
  async getBots(@User() user: IUser) {
    const bots = await this.botsService.getExtendedBots(user.userId)
    
    return {
      bots,
    }
  }
}
