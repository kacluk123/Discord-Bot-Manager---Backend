import { MainBot } from '../bots.factory'
const Discord = require('discord.js');
import { Client, TextChannel, VoiceChannel, Message, Channel, VoiceConnection, StreamDispatcher } from 'discord.js'
import { BotsService } from '../bots.service'
import { MainOptions } from './ad' 
import { ISong } from 'src/music/music.controller';
const ytdl = require('ytdl-core')

export interface IMusicBotConfig {
  playlist: string[]
}

export interface IMusicBotConfigDBResponse {
  playlist: ISong[]
}

export class MusicBot implements MainBot {
  private playlist: PlayList
  client: Client = new Client();
  mainOptions: MainOptions
  musicStream: StreamDispatcher

  constructor(private readonly botsService: BotsService, usabilityConfig: IMusicBotConfig, mainOptions: MainOptions) {
    this.playlist = new PlayList(usabilityConfig.playlist)
    this.mainOptions = mainOptions
  }

  async edit(playlist: string[], mainOptions: MainOptions) {
    this.playlist = new PlayList(playlist)
    this.mainOptions = mainOptions
    
    if (!mainOptions.isActive) {
      this.client.destroy()
    } else {
      this.run()
    }
  }

  public delete = () => {
    this.musicStream.destroy()
    this.client.destroy()
  }
  
  public run() {
    this.client.on('message', async (message) => {
      if (message.content.startsWith('!')) {
        const func = this.getCommands(message).get(message.content)
        if (func && this.mainOptions.isActive) {
          func()
        } else if(!this.mainOptions.isActive) {
          message.channel.send('Bot is currently disabled')
        } else {
          message.channel.send('Command does not exist!')
        }
      } 
    })

    this.client.login(this.mainOptions.token)
  }

  async play(channel: VoiceChannel) {
    try {
      const connection = await channel.join()

      this.musicQuee(connection)
      
    } catch(err) {
      console.log(err)
    }
  }

  async musicQuee(connection: VoiceConnection) {
    const songUrl = this.playlist.song
    const stream = ytdl(songUrl, { filter : 'audioonly' })
    
    this.musicStream = connection.play(stream,  { seek: 0, volume: 1 }).on('finish', () => {
      this.playlist.nextSong()
      this.musicQuee(connection)
    })
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
        },
      ],
      [
        '!pause', async () => {
          const channel = message.member.voice.channel
          if (((logChannel): logChannel is VoiceChannel => logChannel.type === 'voice')(channel)) {
            this.musicStream.pause()
          } 
        }
      ],
      [
        '!start', async () => {
          const channel = message.member.voice.channel
          if (((logChannel): logChannel is VoiceChannel => logChannel.type === 'voice')(channel)) {
            this.musicStream.resume()
          } 
        }
      ],
      [
        '!skip', async () => {
          const channel = message.member.voice.channel
          if (((logChannel): logChannel is VoiceChannel => logChannel.type === 'voice')(channel)) {
            this.musicStream.destroy()
            this.playlist.nextSong()
            await this.play(channel)
          } 
        }
      ]
    ])
  }
}

class PlayList {
  private currentIndex: number = 0
  
  constructor(private songs: string[]) {}

  public nextSong() {
    if (this.currentIndex + 1 > this.songs.length - 1) {
      this.currentIndex = 0
    } else {
      this.currentIndex++
    }
  }

  public get song() {
    return `https://www.youtube.com/watch?v=${this.songs[this.currentIndex]}`
  }
}