import { MainBot } from '../bots.factory'
import { botTypes } from '../bots.entity'
import { BotsService } from '../bots.service'
// var schedule = require('node-schedule');
import { scheduleJob } from 'node-schedule'
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

  constructor(private readonly botsService: BotsService, usabilityConfig: IAdBotConfig, mainOptions: MainOptions) {
    this.ads = usabilityConfig.ads
    this.mainOptions = mainOptions
    setInterval(() => {
      this.getBotData()
    }, 30000)
  }

  // public startSending() {
  //   client.on('message', msg => {
  //     // setInterval(() => {
  //       msg.channel.send(this.aDtext)
  //     // }, 1000)
  //     console.log(msg)
  //   });
  // }

  public restart = async () => {
    this.run()
  }

  public async getBotData() {
    const { config, ...rest } = await this.botsService.getBot(this.mainOptions.id)
    console.log({
      ...rest,
      config
    })
    this.mainOptions = rest
    this.ads = config.ads
  }
  

  public run() {
    client.on('ready', () => {
      // const g = scheduleJob(`45 * * * *`, () => {
      //   if (this.mainOptions.isActive) {
      //     client.channels.cache.get('736938961137827850').send('dasdasd')
      //   }
      // });
      
      this.ads.forEach(ad => {
        const [hour, minute, second] = ad.time.split(':')
        console.log(`${second} ${minute} ${hour} * * * ${ad.day}`)
        const g = scheduleJob({hour: hour, minute: minute, dayOfWeek: ad.day, second: second}, () => {
          if (this.mainOptions.isActive) {
            client.channels.cache.get('736938961137827850').send(ad.message)
          }
        });
      })
    })

    client.login(this.mainOptions.token);
  }
}

export default AdBot