import { botTypes } from './bots.entity'
import { AdBotConfig, AdBot, MainOptions } from './botTypes/ad'
import { botConfigs, isSpecyficUsabilityConfig } from './commonTypes'

export interface MainBot {
  runBot(): void
}

class Bot {
  public getBot(mainOptions: MainOptions, usabilityConfig: botConfigs) {
    switch (mainOptions.type) {
      case 'ads': {
        if (isSpecyficUsabilityConfig<AdBotConfig>(usabilityConfig, mainOptions.type, 'ads')) {
          return new AdBot(usabilityConfig, mainOptions)
        }
      }
    }
  }
}

export default Bot
