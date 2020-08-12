import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  data: string;
}