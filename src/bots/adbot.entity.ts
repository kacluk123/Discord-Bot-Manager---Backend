// import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm'
// import { Bots } from './bots.entity'
// import { IAdBotConfig } from './botTypes/ad'

// @Entity()
// export class AdBotConfig {
//   @PrimaryGeneratedColumn()
//   id: string;
  
//   @Column('json', { nullable: true })
//   ads: IAdBotConfig['ads'] 
  
//   @OneToOne(() => Bots, (bot: Bots) => bot.config)
//   public bot: Bots;
// }
