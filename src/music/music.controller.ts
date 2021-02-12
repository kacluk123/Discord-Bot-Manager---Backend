import { Controller, Get, HttpException, Param, UseGuards } from "@nestjs/common";
import { JwtAuthenticationGuard } from "src/auth/jwt/jwt.guard";
import { MusicService } from './music.service'

export interface ISong {
  id: string;
  title: string;
  img: string;
  description: string;
}


export interface IMusic {
  fetchSongData(id: string): Promise<ISong>
}

@Controller('music')
export class MusicController {
  constructor(
    private readonly musicService: MusicService,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get('/:id')
  async getSongInfoData(@Param() params) {
    try {
      const songInfo = await this.musicService.getSongInfo(params.id)
      return songInfo
    } catch {
      throw new HttpException('Wrong url', 400)
    }
  }
}