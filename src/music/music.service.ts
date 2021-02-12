import { Inject, Injectable } from '@nestjs/common'
import { IMusic } from './music.controller'

@Injectable()
export class MusicService {
  constructor(@Inject('musicInfoService') private readonly musicInfoService: IMusic) {}

  async getSongInfo(id: string) {
    const data = await this.musicInfoService.fetchSongData(id)
    return data
  }
}

