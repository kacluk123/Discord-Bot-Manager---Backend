import Bot from "../bots.factory";
import { BotsService, IBot } from "../bots.service";
import { botNameTypes, BotTypes, isSpecyficUsabilityConfig, isSpecyficBot } from "../commonTypes";
import AdBot, { IAdBotConfig } from "./ad";
import { IMusicBotConfig, MusicBot } from "./music";

export class BotsContainer {
  private bots: Map<string, MusicBot | AdBot>

  constructor(bots: IBot[], private readonly botsService: BotsService) {
    this.bots = this.createBotsMap(bots)
  }

  private createBotsMap(bots: IBot[]) {
    return bots.reduce((prev, curr) => {
      prev.set(curr.id, this.createBot(curr))
      return prev
    }, new Map<string, MusicBot | AdBot>())
  }

  public async runAllBots() {
    this.bots.forEach(bot => {
      bot.run()
    })
  }

  public addBot(bot: IBot) {
    const addedBot = this.createBot(bot)
    this.bots.set(bot.id, addedBot)
  }

  private getBot(id: string) {
    try {
      const bot = this.bots.get(id)
      switch (bot.mainOptions.type) {
        // case 'ad': {
        //   if (isSpecyficBot<IAdBotConfig>(config, bot.type, 'ad')) {
        //     return new AdBot(this.botsService, config, rest)
        //   }
        // }
        case 'music': {
          if (isSpecyficBot<MusicBot>(bot, bot.mainOptions.type, 'music')) {
            return bot
          }
        }
      }
    } catch {
      console.error('Failed to get bot')
    }
  }

  private createBot(bot: IBot) {
    const { config, ...rest} = bot
    switch (bot.type) {
      case 'ad': {
        if (isSpecyficUsabilityConfig<IAdBotConfig>(config, bot.type, 'ad')) {
          return new AdBot(this.botsService, config, rest)
        }
      }
      case 'music': {
        if (isSpecyficUsabilityConfig<IMusicBotConfig>(config, bot.type, 'music')) {
          return new MusicBot(this.botsService, config, rest)
        }
      }
    }
  }

  private editBot(bot: IBot) {
    const { config, ...rest} = bot
    const botObject = this.bots.get(bot.id)
    
    switch (botObject.mainOptions.type) {
      // case 'ad': {
      //   if (isSpecyficBot<IAdBotConfig>(config, bot.type, 'ad')) {
      //     return new AdBot(this.botsService, config, rest)
      //   }
      // }
      case 'music': {
        if (
          isSpecyficBot<MusicBot>(botObject, botObject.mainOptions.type, 'music') 
          && isSpecyficUsabilityConfig<IMusicBotConfig>(config, bot.type, 'music')
        ) {
          botObject.
        }
      }
    }
  }
}
