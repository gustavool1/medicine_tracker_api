import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { dataSource } from './database';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  await dataSource.initialize();
  await dataSource.runMigrations();
  await app.listen(process.env.PORT);
}
bootstrap();
