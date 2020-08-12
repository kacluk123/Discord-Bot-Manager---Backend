import { Module, HttpModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users.entity'
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([Users]), HttpModule]
})

export class UsersModule {}
