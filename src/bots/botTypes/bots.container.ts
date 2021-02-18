import Bot from "../bots.factory";
import { BotsService, IBot } from "../bots.service";
import { botNameTypes, BotTypes, isSpecyficUsabilityConfig } from "../commonTypes";
import AdBot, { IAdBotConfig } from "./ad";
import { IMusicBotConfig, MusicBot } from "./music";

export class BotsContainer {
  private bots: Map<string, MusicBot | AdBot>

  constructor(bots: IBot[], private readonly botsService: BotsService) {
    this.bots = this.createBotsMap(bots)
  }

  private createBotsMap(bots: IBot[]) {
    return bots.reduce((prev, curr) => {
      prev.set(curr.id, this.getBot(curr))
      return prev
    }, new Map<string, MusicBot | AdBot>())
  }

  public async runAllBots() {
    this.bots.forEach(bot => {
      bot.run()
    })
  }

  private getBot(bot: IBot) {
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
}
