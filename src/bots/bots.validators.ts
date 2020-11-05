import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator'
import { botTypes } from './bots.entity'
import { IAdBotConfig } from './botTypes/ad'
import { botConfigs } from './commonTypes'

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
  @IsOptional()
  @IsString()
  name: string
  
  @IsOptional()
  @IsString()
  type: botTypes
  
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  token: string;

  @IsOptional()
  config: botConfigs;
}
