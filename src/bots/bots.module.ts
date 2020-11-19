import { Module } from '@nestjs/common';
import { BotsService } from './bots.service';
import { BotsController } from './bots.controller'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bots } from './bots.entity'
// import { AdBotConfig } from './adbot.entity'
@Module({
  providers: [BotsService],
  exports: [BotsService],
  controllers: [BotsController],
  imports: [TypeOrmModule.forFeature([Bots])]
})
export class BotsModule {}
