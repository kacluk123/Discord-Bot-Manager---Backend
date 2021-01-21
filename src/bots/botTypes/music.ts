import { MainBot } from '../bots.factory'
const Discord = require('discord.js');
import { Client, TextChannel, VoiceChannel, Message, Channel } from 'discord.js'
import { BotsService } from '../bots.service'
import ytdl from 'ytdl-core'
import { MainOptions } from './ad' 

export interface IMusicBotConfig {
  playlist: string[]
}

export class MusicBot implements MainBot {
  private playlist: string[]
  client: Client = new Client();
  mainOptions: MainOptions

  constructor(private readonly botsService: BotsService, usabilityConfig: IMusicBotConfig, mainOptions: MainOptions) {
    this.playlist = usabilityConfig.playlist
    this.mainOptions = mainOptions
  }

  public run() {
    this.client.on('message', async (message) => {
      if (message.content.startsWith('!')) {
        const func = this.getCommands(message).get(message.content)
        if (func) {
          func()
        } else {
          message.channel.send('Command does not exist!')
        }
      } 
    })

    this.client.login(this.mainOptions.token)
  }

  async play(channel: VoiceChannel) {
    const connection = await channel.join()
    connection.play(ytdl('https://www.youtube.com/watch?v=8v8gje3nsA0'))
  }

  private getCommands(message: Message) {
    return new Map([
      [
        '!join-music-bot', async () => {
          const channel = this.client.channels.cache.get(message.channel.id)
          if (((logChannel): logChannel is VoiceChannel => logChannel.type === 'text')(channel)) {
            await message.channel.send('Now bot will be sending ads to this channel!')
            this.play(channel)
          }
          // this.botsService.editBot({
          //   config: {
          //     ...bot.config,
          //     channelsToSend: Array.from(this.channelsWithAds)
          //   }
          // }, bot)
        }
      ],
    ])
  }
}

