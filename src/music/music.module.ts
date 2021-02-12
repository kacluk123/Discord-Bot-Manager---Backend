import { Module, HttpModule, HttpService } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service'
import { YouTube } from './youtube'

@Module({
  providers: [
    MusicService,
    {
      provide: 'musicInfoService',
      useValue: new YouTube(new HttpService()),
    },
  ],
  exports: [MusicService],
  controllers: [MusicController],
  imports: [HttpModule]
})
export class MusicModule {}
