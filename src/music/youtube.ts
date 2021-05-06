import { HttpService, Injectable } from "@nestjs/common";
import { map } from "rxjs/operators";
import { IMusic } from './music.controller' 
import { configService } from "src/config/config.service";

export interface IYoutubeVideoResponse {
  items: {
    id: string,
    snippet: {
      title: string,
      description: string,
      thumbnails: {
        default: {
          url: string
        }
      }
    }
  }[]
}

@Injectable()
export class YouTube implements IMusic {
  constructor(private readonly httpService: HttpService) {}
  
  public async fetchSongData(videoId: string) {
    const response = this.httpService.get<IYoutubeVideoResponse>(`
      https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${configService.getValue('YT_KEY')}
    `)

    return response.pipe(
      map((resp) => {
        const video = resp.data.items[0]

        return {
          id: video.id,
          title: video.snippet.title,
          img: video.snippet.thumbnails.default.url,
          description: video.snippet.description,
        }
      }),
    ).toPromise();
  }
}