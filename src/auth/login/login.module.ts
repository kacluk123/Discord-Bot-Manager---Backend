import { Module, HttpModule } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { UsersModule } from '../../users/users.module'
import  { JwtModule } from '@nestjs/jwt'
import JwtSecret from '../../config/jwt.secret'

@Module({
  providers: [LoginService],
  controllers: [LoginController],
  imports: [HttpModule, UsersModule, JwtModule.register({
    secret: JwtSecret
  })],
})
export class LoginModule {}
