import { AdBotConfig, AdBot} from './botTypes/ad'

export type botNameTypes = 'music' | 'ads'

export type botConfigs = AdBotConfig

export type BotTypes = AdBot

export function isSpecyficUsabilityConfig<T extends botConfigs>(config: botConfigs, 
  botType: botNameTypes, 
  wantedBotType: botNameTypes): config is T {
    return botType === wantedBotType
}