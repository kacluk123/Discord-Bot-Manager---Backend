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
  ],
  exports: [
    MusicService,
    'musicInfoService'
  ],
  controllers: [MusicController],
  imports: [HttpModule]
})
export class MusicModule {}
