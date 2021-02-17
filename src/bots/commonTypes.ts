import { IAdBotConfig, AdBot} from './botTypes/ad'
import { IMusicBotConfig, IMusicBotConfigDBResponse, MusicBot} from './botTypes/music'

export type botNameTypes = 'music' | 'ad'

export type botConfigs = IAdBotConfig | IMusicBotConfig

export type botConfigsDBResponse = IAdBotConfig | IMusicBotConfigDBResponse

export type BotTypes = AdBot | MusicBot

export function isSpecyficUsabilityConfig<T extends botConfigs>(config: botConfigs, 
  botType: botNameTypes, 
  wantedBotType: botNameTypes): config is T {
    return botType === wantedBotType
}