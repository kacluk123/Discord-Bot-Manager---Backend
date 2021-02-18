import { IAdBotConfig, AdBot, MainOptions } from './botTypes/ad'
import { IMusicBotConfig, MusicBot } from './botTypes/music'
import { botConfigs, isSpecyficUsabilityConfig, BotTypes } from './commonTypes'
import { BotsService } from './bots.service'

export interface MainBot {
  run(): void
}

class Bot {
  private mainOptions: MainOptions
  private usabilityConfig: botConfigs
  private bot: MainBot
  private BotsService: BotsService

  constructor(BotsService: BotsService, mainOptions: MainOptions, usabilityConfig: botConfigs) {
    this.mainOptions = mainOptions
    this.usabilityConfig = usabilityConfig
    this.BotsService = BotsService
    this.bot = this.getBot()
  }
  
  private getBot() {
    switch (this.mainOptions.type) {
      case 'ad': {
        if (isSpecyficUsabilityConfig<IAdBotConfig>(this.usabilityConfig, this.mainOptions.type, 'ad')) {
          return new AdBot(this.BotsService, this.usabilityConfig, this.mainOptions)
        }
      }
      case 'music': {
        if (isSpecyficUsabilityConfig<IMusicBotConfig>(this.usabilityConfig, this.mainOptions.type, 'music')) {
          return new MusicBot(this.BotsService, this.usabilityConfig, this.mainOptions)
        }
      }
    }
  }

  public runBot() {
    this.bot.run()
  }
}

export default Bot
