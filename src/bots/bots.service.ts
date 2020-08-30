import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bots } from './bots.entity'
import { Repository } from 'typeorm';
import { botTypes } from './bots.entity'
import { throwIfEmpty } from 'rxjs/operators';
import { CreateBotDto } from './bots.validators'

interface IBot {
  name: string,
  type: botTypes,
  isActive: true,
  token: string,
  userId: string
}

@Injectable()
export class BotsService {
  constructor(@InjectRepository(Bots) private readonly repo: Repository<Bots>) {}

  public async addBot(botData: CreateBotDto) {
    const bot = await this.repo.save<CreateBotDto>(botData)
    return bot
  }

  public async checkThatKeyExist(token: string): Promise<Boolean> {
    const bot = await this.repo.findOne({ token });
    
    return Boolean(bot)
  }
}
