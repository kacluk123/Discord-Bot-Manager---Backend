import { MainBot } from '../bots.factory'
import { botTypes } from '../bots.entity'
import { BotsService } from '../bots.service'
// var schedule = require('node-schedule');
import { scheduleJob, Job } from 'node-schedule'
const Discord = require('discord.js');
const client = new Discord.Client()

// const client = new Discord.Client();
export interface IAdBotConfig {
  ads: ISingleAd[]
}

export interface ISingleAd {
  time: string 
  day: string
  message: string
  id: string
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
      this.reloadBot()
    }, 15000)
  }

  public restart = async () => {
    this.run()
  }

  public async reloadBot() {
    const { config, ...rest } = await this.botsService.getBot(this.mainOptions.id)
    
    this.makeActionDependsOnCurrentBotState(rest, config)

    this.mainOptions = rest
    
    this.ads = config.ads
  }

  private makeActionDependsOnCurrentBotState(mainOptions: MainOptions , config: IAdBotConfig) {
    if (this.allSchedules.size === 0 && mainOptions.isActive) {
      this.allSchedules = this.runAds(config.ads)
    }

    if (!mainOptions.isActive) {
      this.turnOffAllBots()
    }

    if (this.allSchedules.size > 0 && this.mainOptions.isActive) {
      this.rebuildAds(config.ads)
    }
  }

  private turnOffAllBots() {
    this.allSchedules.forEach((value,key,map) => {
      this.allSchedules.get(key).cancel()
    })
    this.allSchedules = new Map()
  }

  private runAd = (ad: ISingleAd, ads: Map<string, Job>) => {
    const [hour, minute, second] = ad.time.split(':')
      ads.set(ad.id, scheduleJob({hour: hour, minute: minute, dayOfWeek: ad.day, second: second}, () => {
        client.channels.cache.get('736938961137827850').send(ad.message)
    }))
  }

  public rebuildAds = (ads: IAdBotConfig['ads']) => {
    ads.forEach(ad => {
      const existedAd = this.ads.find(existedAd => existedAd.id === ad.id)
      const existedSchedule = this.allSchedules.get(ad.id)

      if (existedAd && (JSON.stringify(existedAd) !== JSON.stringify(ad))) {
        existedSchedule.cancel()
        this.runAd(ad, this.allSchedules)
      } 
      if (!existedSchedule) {
        console.log('yes')
        this.runAd(ad, this.allSchedules)
      }
    })
  }
  
  private runAds = (ads: IAdBotConfig['ads']) => {
    return ads.reduce((prev,curr) => {
      this.runAd(curr, prev)
      return prev
    }, new Map<string, Job>())
  }

  public run() {
    client.on('ready', () => {
      if (this.mainOptions.isActive) {
        this.allSchedules = this.runAds(this.ads)
      }
    })

    client.login(this.mainOptions.token);
  }
}

export default AdBot