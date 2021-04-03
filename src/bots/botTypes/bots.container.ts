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

  public editBot(botData: IBot) {
    const { config, ...rest} = botData
    const bot = this.bots.get(botData.id)
    
    switch (bot.mainOptions.type) {
      case 'ad': {
        if (isSpecyficBot<AdBot>(bot, bot.mainOptions.type, 'ad') 
        && isSpecyficUsabilityConfig<IAdBotConfig>(config, botData.type, 'ad')) {
          bot.edit(botData)
        }
      }
      case 'music': {
        if (
          isSpecyficBot<MusicBot>(bot, bot.mainOptions.type, 'music') 
          && isSpecyficUsabilityConfig<IMusicBotConfig>(config, botData.type, 'music')
        ) {
          bot.edit(config.playlist, rest)
        }
      }
    }
  }

  public deleteBot(id: string) {
    const bot = this.bots.get(id)
    console.log(bot)
    bot.delete()
  }
}
