import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm'
import { Bots } from './bots.entity'

@Entity()
export class AdBotConfig {
  @PrimaryGeneratedColumn()
  id: string;
  
  @Column({ nullable: true })
  timeToResend: number 
  
  @Column({ nullable: true })
  aDtext: string
  
  @OneToOne(() => Bots, (bot: Bots) => bot.config)
  public bot: Bots;
}
