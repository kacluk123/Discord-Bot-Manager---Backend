import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm'
import { IAdBotConfig } from './botTypes/ad'
import { IMusicBotConfig } from './botTypes/music'
import { botNameTypes } from './commonTypes';

@Entity()
export class Bots {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string

  @Column()
  type: botNameTypes

  @Column({ default: true })
  isActive: boolean;

  @Column()
  token: string;

  @Column()
  userId: string;
  
  @Column('json', { nullable: true })
  public config: IAdBotConfig | IMusicBotConfig;
}