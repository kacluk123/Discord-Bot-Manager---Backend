import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bots } from './bots.entity'
import { Repository } from 'typeorm';

@Injectable()
export class BotsService {
  constructor(@InjectRepository(Bots) private readonly repo: Repository<Bots>) {}
}
