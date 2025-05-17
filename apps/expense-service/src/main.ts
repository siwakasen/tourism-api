import { NestFactory } from '@nestjs/core';
import { ExpenseServiceModule } from './expense-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ExpenseServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
