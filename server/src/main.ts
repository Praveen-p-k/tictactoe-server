import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as configVars } from 'config';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  /** Data size limits */
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  /** CORS */
  app.enableCors({
    origin: (origin, callback) => {
      if (
        !configVars.APP_CORS_WHITELIST_URLS ||
        configVars.APP_CORS_WHITELIST_URLS.includes(origin) ||
        configVars.APP_CORS_WHITELIST_URLS === '*' ||
        !origin
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  /** BACKEND CONFIGS */
  // For handling validation of input datas
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix(configVars.APP_BACKEND_PREFIX);

  /** SWAGGER */
  const config = new DocumentBuilder()
    .setTitle('Odyssey APIs')
    .setDescription('Odyssey APIs')
    .setVersion('1.0')
    .addTag('TokenManagement')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configVars.PORT);
}
bootstrap();
