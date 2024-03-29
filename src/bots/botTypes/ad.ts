import { MainBot } from '../bots.factory'
import { BotsService, IBot } from '../bots.service'
// var schedule = require('node-schedule');
import { scheduleJob, Job } from 'node-schedule'
const Discord = require('discord.js');
import { Client, TextChannel, Message } from 'discord.js'
import { botNameTypes } from '../commonTypes';
export interface IAdBotConfig {
  ads: ISingleAd[]
  channelsToSend: string[]
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
  type: botNameTypes
  isActive: boolean
  id: string
}

export class AdBot implements MainBot {
  client: Client = new Client();
  ads: IAdBotConfig['ads']
  mainOptions: MainOptions
  allSchedules: Map<string, Job> = new Map()
  channelsWithAds: Set<string>

  constructor(private readonly botsService: BotsService, usabilityConfig: IAdBotConfig, mainOptions: MainOptions) {
    this.ads = usabilityConfig.ads
    this.mainOptions = mainOptions
    this.channelsWithAds = new Set(usabilityConfig.channelsToSend);
  }

  edit(bot: IBot) {
    this.reloadBot(bot)
  }

  public delete = () => {
    this.allSchedules.forEach((value,key,map) => {
      this.allSchedules.get(key).cancel()
    })
    this.client.destroy()
  }

  public restart = async () => {
    this.run()
  }

  public async reloadBot(bot: IBot) {
    const { config: resConfig , ...rest } = bot
    const config = resConfig as IAdBotConfig

    this.makeActionDependsOnCurrentBotState(rest, config)

    this.mainOptions = rest

    this.ads = config.ads
    this.channelsWithAds = new Set(config.channelsToSend)
  }

  private makeActionDependsOnCurrentBotState(mainOptions: MainOptions , config: IAdBotConfig) {
    if (!mainOptions.isActive) {
      this.turnOffAllBots()
    } else {
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
    if (this.channelsWithAds.size > 0) {
      const [hour, minute, second] = ad.time.split(':')
      this.channelsWithAds.forEach((channelId) => {
        const channel = this.client.channels.cache.get(channelId)
        ads.set(ad.id, scheduleJob({hour: hour, minute: minute, dayOfWeek: ad.day, second: second}, () => {
          if (((logChannel): logChannel is TextChannel => logChannel.type === 'text')(channel)) {
            channel.send(ad.message)
          }
        }))
      })
    }
  }

  public rebuildAds = (ads: IAdBotConfig['ads']) => {
    this.allSchedules.forEach(el => {
      el.cancel()
    })
    this.allSchedules = new Map()
    this.allSchedules = this.runAds(ads)
  }
  
  private runAds = (ads: IAdBotConfig['ads']) => {
    return ads.reduce((prev,curr) => {
      this.runAd(curr, prev)
      return prev
    }, new Map<string, Job>())
  }

  public run() {
    this.client.once('ready', () => {
      if (this.mainOptions.isActive) {
        this.allSchedules = this.runAds(this.ads)
      }
    })

    this.client.on('message', async (message) => {
      if (message.content.startsWith('!')) {
        const func = this.getCommands(message).get(message.content)
        if (func) {
          func()
        } else {
          message.channel.send('Command does not exist!')
        }
      } 
    })

    this.client.login(this.mainOptions.token)
  }

  private getCommands(message: Message) {
    return new Map([
      [
        '!join-ad-bot', async () => {
          if (this.channelsWithAds.has(message.channel.id)) {
            return 
          } else {
            this.channelsWithAds.add(message.channel.id)
            await message.channel.send('Now bot will be sending ads to this channel!')
            const bot = await this.botsService.getBot(this.mainOptions.id)
            const data = await this.botsService.editBot({
              config: {
                ...bot.config,
                channelsToSend: Array.from(this.channelsWithAds)
              }
            }, bot)
          }
        }
      ],
      [
        '!remove-ad-bot', async () => {
          if (this.channelsWithAds.has(message.channel.id)) {
            this.channelsWithAds.delete(message.channel.id)
            await message.channel.send('Now bot will not be sending ads to this channel!')
            const bot = await this.botsService.getBot(this.mainOptions.id)
            this.botsService.editBot({
              config: {
                ...bot.config,
                channelsToSend: Array.from(this.channelsWithAds)
              }
            }, bot)
          } else {
            message.channel.send('Bot was never on this channel')
          }
        }
      ]
    ])
  }
}

export default AdBot