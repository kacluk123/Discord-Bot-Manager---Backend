import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

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
}