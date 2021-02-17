import { Module, HttpModule, HttpService } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service'
import { YouTube } from './youtube'

@Module({
  providers: [
    {
      provide: 'musicInfoService',
      useClass: YouTube,
    },
    MusicService,
    YouTube
  ],
  exports: [
    MusicService,
    YouTube,
    'musicInfoService'
  ],
  controllers: [MusicController],
  imports: [HttpModule]
})
export class MusicModule {}
