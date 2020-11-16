import { MainBot } from '../bots.factory'
import { botTypes } from '../bots.entity'
import { BotsService } from '../bots.service'
// var schedule = require('node-schedule');
import { scheduleJob, Job } from 'node-schedule'
import { ADDRCONFIG } from 'dns';
const Discord = require('discord.js');
const client = new Discord.Client()

// const client = new Discord.Client();
export interface IAdBotConfig {
  ads: {
    time: string 
    day: string
    message: string
    id: string
  }[]
}

export interface MainOptions {
  token: string
  name: string
  type: botTypes
  isActive: boolean
  id: string
}

export class AdBot implements MainBot {
  ads: IAdBotConfig['ads']
  mainOptions: MainOptions
  allSchedules: Map<string, Job> = new Map()

  constructor(private readonly botsService: BotsService, usabilityConfig: IAdBotConfig, mainOptions: MainOptions) {
    this.ads = usabilityConfig.ads
    this.mainOptions = mainOptions
    setInterval(() => {
      this.getBotData()
    }, 5000)
  }

  public restart = async () => {
    this.run()
  }

  public async getBotData() {
    const { config, ...rest } = await this.botsService.getBot(this.mainOptions.id)

    this.mainOptions = rest
    this.ads = config.ads

    this.rebuildAds(config.ads)
  }

  public rebuildAds = (ads: IAdBotConfig['ads']) => {
    ads.forEach(ad => {
      const existedAd = this.ads.find(existedAd => existedAd.id === ad.id)
      const existedSchedule = this.allSchedules.get(ad.id)

      // if (existedAd && (JSON.stringify(existedAd) !== JSON.stringify(ad))) {
      //   existedSchedule.cancel()
      //   const [hour, minute, second] = ad.time.split(':')
      //   this.allSchedules.set(ad.id, scheduleJob({hour: hour, minute: minute, dayOfWeek: ad.day, second: second}, () => {
      //     if (this.mainOptions.isActive) {
      //       client.channels.cache.get('736938961137827850').send(ad.message)
      //     }
      //   }))
      // } 
      if (!existedSchedule) {
        console.log('yes')
        const [hour, minute, second] = ad.time.split(':')
        this.allSchedules.set(ad.id, scheduleJob({hour: hour, minute: minute, dayOfWeek: ad.day, second: second}, () => {
          if (this.mainOptions.isActive) {
            client.channels.cache.get('736938961137827850').send(ad.message)
          }
        }))
      }
    })
  }
  

  public run() {
    client.on('ready', () => {
      this.ads.forEach(ad => {
        const [hour, minute, second] = ad.time.split(':')
        this.allSchedules.set(ad.id, scheduleJob({hour: hour, minute: minute, dayOfWeek: ad.day, second: second}, () => {
          if (this.mainOptions.isActive) {
            client.channels.cache.get('736938961137827850').send(ad.message)
          }
        }))
      })
    })

    client.login(this.mainOptions.token);
  }
}

export default AdBot