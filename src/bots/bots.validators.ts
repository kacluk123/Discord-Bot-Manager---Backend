import { IsNotEmpty, IsString, IsBoolean, IsOptional, isArray, ValidatorConstraint, ValidatorConstraintInterface, Validate } from 'class-validator'
import { botTypes } from './bots.entity'
import { IAdBotConfig } from './botTypes/ad'
import { botConfigs } from './commonTypes'
import { registerDecorator, ValidationOptions, ValidationArguments, IsObject, ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { HttpService, Inject, Injectable } from '@nestjs/common';
import { MusicService } from '../music/music.service'
import { YouTube } from 'src/music/youtube';

export function isDay(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsDay',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const dayOfWeek = Array.from({length: 7}, (v, k) => (k + 1).toString()); 

          return dayOfWeek.includes(value)
        },
      },
    });
  };
}

const minuteAndSeconds = [
  ...Array.from({length: 59}, (v, k) => k.toString().length === 1 ? `0${k.toString()}` : k.toString()),
  "59"
]
const hours = [
  ...Array.from({length: 24}, (v, k) => k.toString().length === 1 ? `0${k.toString()}` : k.toString()),
  "23"
]

export function isTime(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsDay',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const [hour, minute, second] = value.split(':')

          return hours.includes(hour) && minuteAndSeconds.includes(minute) && minuteAndSeconds.includes(second)
        }, 
      },
    });
  };
}

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidMusicLinks implements ValidatorConstraintInterface {
  private readonly musicService: MusicService = new MusicService(new YouTube(new HttpService()))

	async validate(value: string[]) {
    try {
      const musicIds = value.map(songId => this.musicService.getSongInfo(songId))
      await Promise.all(musicIds)
      return true
    } catch {
      return false
    }
	}

  defaultMessage() {
    return 'Not valid youtube link';
  }
}

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

class BaseFeature {
  type: botTypes
}
class AdsBotDto  {
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  channelsToSend: string[]
  
  @ArrayMinSize(1)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdBotDto)
  ads: AdBotDto[]
}

class MusicBotDto  {
  @ArrayMinSize(1)
  @IsArray()
  @Validate(IsValidMusicLinks)
  playlist: string[]
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
  @IsObject()
  @ValidateNested()
  @Type(() => BaseFeature, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: AdsBotDto, name: 'ad' },
        { value: MusicBotDto, name: 'music' },
      ],
    },
  })
  config: AdsBotDto | MusicBotDto;
}

class AdBotDto {
  @isTime({ message: 'Invalid date format. Plase provide time in hh:mm:ss format '})
  @IsString()
  @IsNotEmpty()
  time: string 
  
  @isDay({ message: 'Day must contain value from 1 to 7'})
  @IsString()
  @IsNotEmpty()
  day: string

  @IsString()
  @IsNotEmpty()
  message: string
  
  @IsString()
  @IsNotEmpty()
  id: string
}