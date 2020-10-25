import { botTypes } from './bots.entity'
import { AdBotConfig, AdBot, MainOptions } from './botTypes/ad'
import { botConfigs, isSpecyficUsabilityConfig, BotTypes } from './commonTypes'

export interface MainBot {
  run(): void
}

class Bot {
  private mainOptions: MainOptions
  private usabilityConfig: botConfigs
  private bot: MainBot

  constructor(mainOptions: MainOptions, usabilityConfig: botConfigs) {
    this.mainOptions = mainOptions
    this.usabilityConfig = usabilityConfig
    this.bot = this.getBot()
  }
  
  private getBot() {
    switch (this.mainOptions.type) {
      case 'ads': {
        if (isSpecyficUsabilityConfig<AdBotConfig>(this.usabilityConfig, this.mainOptions.type, 'ads')) {
          return new AdBot(this.usabilityConfig, this.mainOptions)
        }
      }
    }
  }

  public runBot() {
    this.bot.run()
  }
}

export default Bot
