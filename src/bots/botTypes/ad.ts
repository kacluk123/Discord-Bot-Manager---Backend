const Discord = require('discord.js');
const client = new Discord.Client()

// const client = new Discord.Client();
export interface AdBotConfig {
  timeToResend: number
  aDtext: string
}

class AdBot {
  timeToResend: number
  aDtext: string

  constructor(response: AdBotConfig) {
    this.aDtext = response.aDtext
    this.timeToResend = response.timeToResend
  }

  // public startSending() {
  //   client.on('message', msg => {
  //     // setInterval(() => {
  //       msg.channel.send(this.aDtext)
  //     // }, 1000)
  //     console.log(msg)
  //   });
  // }

  public runBot() {
    client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`);
      console.log(client.channels.cache.get('736938961137827850').send('siema'))
    });
    
    // const channel = client.channels.cache.find(channel => channel.name === channelName)
    // this.startSending()
    client.login('NzYwNTI3NjUwOTA0MzQyNTg4.X3NWkQ.m3_gYQ9yBBW08DxNRrKpWQV6A5U');
  }
}

export default AdBot