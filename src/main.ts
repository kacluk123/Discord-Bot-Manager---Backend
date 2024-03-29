import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module';
import { BotsService } from './bots/bots.service'
import * as cookieParser from 'cookie-parser';
import Bot from './bots/bots.factory'
import { useContainer } from 'typeorm';
import { BotsContainer } from './bots/botTypes/bots.container';

export let botsContainer: BotsContainer

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), {fallbackOnErrors: true})

  app.enableCors({ 
    origin: ['http://localhost:8080', 'https://bot-manager-front.herokuapp.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    forbidUnknownValues: true,
    validationError: { 
      target: false 
    }
  }));
  const service = app.get(BotsService)
  
  const bots = await service.getBots()
  
  botsContainer = new BotsContainer(bots, service)

  await botsContainer.runAllBots()

  await app.listen(process.env.PORT);
}

bootstrap();
