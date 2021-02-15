import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './auth/login/login.module';
import { configService } from './config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { LoginController } from './auth/login/login.controller';
import { UsersModule } from './users/users.module'; 
import { CookiesModule } from './cookies/cookies.module';
import { BotsController } from './bots/bots.controller';
import { BotsModule } from './bots/bots.module';
import { MusicModule } from './music/music.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()), 
    UsersModule, 
    LoginModule, 
    CookiesModule, 
    BotsModule, 
    MusicModule,
  ],
  controllers: [AppController, BotsController],
  providers: [AppService],
})
export class AppModule {}
