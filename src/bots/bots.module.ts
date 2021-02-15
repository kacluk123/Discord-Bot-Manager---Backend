import { Module, HttpModule } from '@nestjs/common';
import { BotsService } from './bots.service';
import { BotsController } from './bots.controller'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bots } from './bots.entity'
import { MusicService } from '../music/music.service'
import { YouTube } from '../music/youtube'
import { MusicModule } from '../music/music.module'
import { IsValidMusicLinks } from './bots.validators'
// import { AdBotConfig } from './adbot.entity'

@Module({
  providers: [
    BotsService,
    IsValidMusicLinks, 
  ],
  exports: [BotsService],
  controllers: [BotsController],
  imports: [
    TypeOrmModule.forFeature([Bots]), 
    HttpModule,
    MusicModule
  ]
})
export class BotsModule {}
