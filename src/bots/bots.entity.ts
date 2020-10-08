import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm'
import { AdBotConfig } from './adbot.entity'
export type botTypes = 'music' | 'ads'

@Entity()
export class Bots {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string

  @Column()
  type: botTypes

  @Column({ default: true })
  isActive: boolean;

  @Column()
  token: string;

  @Column()
  userId: string;

  @OneToOne(() => AdBotConfig, (adBotConfig: AdBotConfig) => adBotConfig.bot, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  public config: AdBotConfig;
}