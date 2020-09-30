import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const fs = require('fs');
  const path = require('path');
  const keyFile  = fs.readFileSync(__dirname + '/../ssl/localhost+2-key.pem');
  const certFile = fs.readFileSync(__dirname + '/../ssl/localhost+2.pem');

  const app = await NestFactory.create(AppModule, {
    // httpsOptions: {
    //   key: keyFile,
    //   cert: certFile,
    // }
  });
  app.enableCors({  // wrong!  in my case, anyway
    origin: 'http://localhost:8080',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
