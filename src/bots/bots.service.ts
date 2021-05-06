import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bots } from './bots.entity'
import { Repository } from 'typeorm';
import { map, throwIfEmpty } from 'rxjs/operators';
import { CreateBotDto, EditBotDto } from './bots.validators'
import { ICreateBotBody } from './bots.controller'
import { botConfigs, isSpecyficUsabilityConfig, botConfigsDBResponse, botNameTypes } from './commonTypes'
import { MusicService } from 'src/music/music.service';
import { IMusicBotConfig } from './botTypes/music';
import { IAdBotConfig } from './botTypes/ad';

export interface IBot {
  id: string
  name: string,
  type: botNameTypes,
  isActive: boolean,
  token: string,
  userId: string
  config: botConfigs
}

export interface IBotsDBResponse extends Omit<IBot, 'config'> {
  config: botConfigsDBResponse
}

export interface IGetBot<T> {
  id: string
  name: string,
  type: botNameTypes,
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
    private readonly musiceService: MusicService,
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
    const bots = await this.repo.find(userId && { userId })

    return bots
  }

  public async getExtendedBots(userId?: string) {
    try {
      const bots = await this.getBots(userId)
      return this.buffBotsListWithAdditionalData(bots)
    } catch {
      throw new HttpException('Failed to get bots list', 400)
    }
  }

  public async deleteBot(botId: string) {
    console.log(botId)
    const bot = await this.repo.delete({ id: botId })

    return {
      message: `Bot with ID: ${botId} has been deleted`
    }
  }

  private async buffBotsListWithAdditionalData(bots: IBot[]) {
    return Promise.all(bots.map(bot => this.buffBotWithAdditionalData(bot)))
  }

  private async buffBotWithAdditionalData(bot: IBot) {
    if (isSpecyficUsabilityConfig<IMusicBotConfig>(bot.config, bot.type, 'music')) {
      const songsData = await this.musiceService.getAllSongsInfo(bot.config.playlist)
      return {
        ...bot,
        config: {
          ...bot.config,
          playlist: songsData
        }
      }
    }
    return bot
  }
}
