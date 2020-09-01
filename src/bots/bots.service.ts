import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bots } from './bots.entity'
import { Repository } from 'typeorm';
import { botTypes } from './bots.entity'
import { throwIfEmpty } from 'rxjs/operators';
import { CreateBotDto } from './bots.validators'
import { ICreateBotBody } from './bots.controller'

export interface IBot {
  id: string
  name: string,
  type: botTypes,
  isActive: boolean,
  token: string,
  userId: string
}

@Injectable()
export class BotsService {
  constructor(@InjectRepository(Bots) private readonly repo: Repository<Bots>) {}

  public async addBot(botData: ICreateBotBody): Promise<IBot> {
    const bot = await this.repo.save<ICreateBotBody>(botData)
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
}
