import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ApiModule } from './api.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { FormatErrorInterceptor } from 'libs/helper/interceptors/exeption.interceptor';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(ApiModule);
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');

  app.set('trust proxy', 1);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  //   app.useGlobalInterceptors(new FormatErrorInterceptor());
  const configSwagger = new DocumentBuilder()
    .setTitle('Admin Api Service')
    .setDescription('API for Admin data CRUD')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`http://localhost:${port}`)
    .addServer(`https://drivers.cashtrack.my.id`)
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port, () => {
    console.log('[Drivers Service]', `http://localhost:${port}`);
  });
}

bootstrap();
