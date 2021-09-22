import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { getConfig, isDevProfile, readLocalFileSync } from './util';

async function bootstrap() {
  const config = getConfig();
  const app: INestApplication = await (isDevProfile()
    ? createDevApp()
    : createProdApp());
  app.use(cookieParser());
  await app.listen(config.port);
}
bootstrap();

async function createProdApp(): Promise<INestApplication> {
  return await NestFactory.create(AppModule, {
    httpsOptions: {
      key: readLocalFileSync('plandot.app.key'),
      cert: readLocalFileSync('plandot.app.crt'),
      ca: [
        readLocalFileSync('cert_1.crt'),
        readLocalFileSync('cert_2.crt'),
        readLocalFileSync('cert_3.crt'),
      ],
    },
  });
}

async function createDevApp(): Promise<INestApplication> {
  return await NestFactory.create(AppModule);
}
