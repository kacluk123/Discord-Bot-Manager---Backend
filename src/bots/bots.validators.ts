import { IsNotEmpty, IsString, IsBoolean } from 'class-validator'
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
}

export class EditBotDto {
  @IsString()
  name: string

  @IsString()
  type: botTypes

  @IsBoolean()
  isActive: boolean;

  @IsString()
  token: string;
}
