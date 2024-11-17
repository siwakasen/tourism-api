import { NestFactory } from '@nestjs/core';
import { TourApiModule } from './tour-api.module';

async function bootstrap() {
  const app = await NestFactory.create(TourApiModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
