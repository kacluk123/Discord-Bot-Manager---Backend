import { Module } from '@nestjs/common';
import { BotsService } from './bots.service';
import { BotsController } from './bots.controller'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bots } from './bots.entity'
@Module({
  providers: [BotsService],
  controllers: [BotsController],
  imports: [TypeOrmModule.forFeature([Bots])]
})
export class BotsModule {}
