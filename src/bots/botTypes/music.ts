import { MainBot } from '../bots.factory'
const Discord = require('discord.js');
import { Client, TextChannel, VoiceChannel, Message, Channel } from 'discord.js'
import { BotsService } from '../bots.service'
import { MainOptions } from './ad' 
const ytdl = require('ytdl-core')

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
    try {
      const streamOptions = { seek: 0, volume: 1 };
      const connection = await channel.join()
      const stream = ytdl('https://www.youtube.com/watch?v=-I9QH6gI6wM', { filter : 'audioonly' });
      connection.play(stream, streamOptions);
    } catch(err) {
      console.log(err)
    }
  }

  private getCommands(message: Message) {
    return new Map([
      [
        '!join-music-bot', async () => {
          const channel = message.member.voice.channel
          if (((logChannel): logChannel is VoiceChannel => logChannel.type === 'voice')(channel)) {
            await message.channel.send('Now bot will be playing music on this channel!')
            await this.play(channel)
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

