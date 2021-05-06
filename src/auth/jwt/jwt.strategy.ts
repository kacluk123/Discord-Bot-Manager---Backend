import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { configService } from 'src/config/config.service';

export interface IUser {
  userId: string,
  discordToken: string,
  iat: number,
  exp: number
}

export interface RequestWithUser extends Request {
  user: IUser
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.Authorization;
      }]),
      secretOrKey: configService.getValue('JWT_SECRET')
    });
  }
 
  async validate(payload: {
    userId: string,
    discordToken: string
  }) {
    return payload
  }
}