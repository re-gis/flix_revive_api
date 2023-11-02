/* eslint-disable */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req, res, next) => {
    res.setTimeout(300000000, () => {
      res.status(408).end();
    });
    next();
  });
  await app.listen(3000);
}
bootstrap();
