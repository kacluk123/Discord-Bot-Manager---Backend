import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bots } from './bots.entity'
import { Repository } from 'typeorm';
import { botTypes } from './bots.entity'
import { throwIfEmpty } from 'rxjs/operators';
import { CreateBotDto, EditBotDto } from './bots.validators'
import { ICreateBotBody } from './bots.controller'
import { AdBotConfig } from './botTypes/ad'

export interface IBot {
  id: string
  name: string,
  type: botTypes,
  isActive: boolean,
  token: string,
  userId: string
  config: AdBotConfig
}

function createBotDependsOnType (botData: ICreateBotBody) {
  switch (botData.type) {
    case 'ads': {
      return {
        ...botData, 
        config: {
          timeToResend: null,
          aDtext: null
        }
      }
    }
  }
}

@Injectable()
export class BotsService {
  constructor(@InjectRepository(Bots) private readonly repo: Repository<Bots>) {}

  public async addBot(botData: ICreateBotBody): Promise<IBot> {
    const bot = await this.repo.save(createBotDependsOnType(botData))

    return bot
  }

  public async editBot(newBotData: EditBotDto, originalBot: IBot): Promise<IBot> {
    const bot = await this.repo.save({
      ...originalBot,
      ...newBotData
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

  public async getBots(userId: string): Promise<IBot[]> {
    const bot = await this.repo.find({ userId })

    return bot
  }

  public async deleteBot(botId: string) {
    const bot = await this.repo.delete({ id: botId })

    return {
      message: `Bot with ID: ${botId} has been deleted`
    }
  }
}
