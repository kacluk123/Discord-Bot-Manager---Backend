import { HttpService, Injectable } from "@nestjs/common";
import { map } from "rxjs/operators";
import { IMusic } from './music.controller' 
import { YOUTUBE_API_KEY } from '../config/youtube.secret'

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
      https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${YOUTUBE_API_KEY}
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