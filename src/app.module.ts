import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './auth/login/login.module';
import { configService } from './config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { LoginController } from './auth/login/login.controller';
import { UsersModule } from './users/users.module'; 


@Module({
  imports: [TypeOrmModule.forRoot(configService.getTypeOrmConfig()), UsersModule, LoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
