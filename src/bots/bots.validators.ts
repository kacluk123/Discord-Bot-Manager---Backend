import { IsNotEmpty, IsString, IsBoolean,  } from 'class-validator'
import { botTypes } from './bots.entity'

export class CreateBotDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  type: botTypes

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}

