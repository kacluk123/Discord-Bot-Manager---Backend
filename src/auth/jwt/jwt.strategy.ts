import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import JwtSercet from '../../config/jwt.secret'
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.Authorization;
      }]),
      secretOrKey: JwtSercet
    });
  }
 
  async validate(payload: {
    userId: string,
    discordToken: string
  }) {
    return payload
  }
}