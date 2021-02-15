import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bots } from './bots.entity'
import { Repository } from 'typeorm';
import { botTypes } from './bots.entity'
import { map, throwIfEmpty } from 'rxjs/operators';
import { CreateBotDto, EditBotDto } from './bots.validators'
import { ICreateBotBody } from './bots.controller'
import { botConfigs } from './commonTypes'
import { YOUTUBE_API_KEY } from '../config/youtube.secret'
export interface IBot {
  id: string
  name: string,
  type: botTypes,
  isActive: boolean,
  token: string,
  userId: string
  config: botConfigs
}

export interface IGetBot<T> {
  id: string
  name: string,
  type: botTypes,
  isActive: boolean,
  token: string,
  userId: string
  config: T
}

function createBotDependsOnType (botData: ICreateBotBody) {
  switch (botData.type) {
    case 'ad': {
      return {
        ...botData, 
        config: {
          type: botData.type,
          ads: []
        }
      }
    }
    case 'music': {
      return {
        ...botData, 
        config: {
          type: botData.type,
          playlist: []
        }
      }
    }
  }
}

@Injectable()
export class BotsService {
  constructor(
    @InjectRepository(Bots) private readonly repo: Repository<Bots>,
    private readonly httpService: HttpService,
  ) {}

  public async addBot(botData: ICreateBotBody): Promise<IBot> {
    const bot = await this.repo.save(createBotDependsOnType(botData))

    return bot
  }

  public async editBot(newBotData: Partial<EditBotDto>, originalBot: IBot): Promise<IBot> {
    const bot = await this.repo.save({
      ...originalBot,
      ...newBotData,
    })
    return bot
  }

  public async checkThatKeyExist(token: string): Promise<Boolean> {
    const bot = await this.repo.findOne({ token });
    
    return Boolean(bot)
  }

  public async getBot(botId: string): Promise<IBot> {
    const bot = await this.repo.findOne({ id: botId });

    return bot
  }

  public async getBots(userId?: string): Promise<IBot[]> {
    const bot = await this.repo.find(userId && { userId })

    return bot
  }

  public async deleteBot(botId: string) {
    const bot = await this.repo.delete({ id: botId })

    return {
      message: `Bot with ID: ${botId} has been deleted`
    }
  }
}
