import { AdBotConfig } from './botTypes/ad'

export type botTypes = 'music' | 'ads'

interface x {
  a: string
}

export type botConfigs = AdBotConfig | x

export function isSpecyficUsabilityConfig<T extends botConfigs>(config: botConfigs, 
  botType: botTypes, 
  wantedBotType: botTypes): config is T {
    return botType === wantedBotType
}