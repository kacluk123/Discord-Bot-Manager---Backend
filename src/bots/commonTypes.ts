import { IAdBotConfig, AdBot} from './botTypes/ad'

export type botNameTypes = 'music' | 'ad'

export type botConfigs = IAdBotConfig

export type BotTypes = AdBot

export function isSpecyficUsabilityConfig<T extends botConfigs>(config: botConfigs, 
  botType: botNameTypes, 
  wantedBotType: botNameTypes): config is T {
    return botType === wantedBotType
}