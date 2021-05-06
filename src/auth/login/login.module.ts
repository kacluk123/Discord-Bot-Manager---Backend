import { Module, HttpModule } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { UsersModule } from '../../users/users.module'
import { CookiesModule } from '../../cookies/cookies.module'
import  { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from '../jwt/jwt.strategy'
import { configService } from 'src/config/config.service';

@Module({
  providers: [LoginService, JwtStrategy],
  controllers: [LoginController],
  imports: [HttpModule, UsersModule, JwtModule.register({
    secret: configService.getValue('JWT_SECRET')
  }), CookiesModule],
})
export class LoginModule {}
