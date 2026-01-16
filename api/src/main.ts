import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Функция инициализации и запуска приложения Placer API
 *
 * Настраивает:
 * - CORS политики для кросс-доменных запросов
 * - Версионирование API через URI
 * - Swagger документацию для API
 * - HTTP сервер на порту 3000
 */
async function bootstrap(): Promise<void> {
  // Создание экземпляра NestJS приложения с настройками CORS
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  // Получаем ConfigService после инициализации
  const configService = app.get(ConfigService);
  const corsOrigin = configService.get<string>('CORS_ORIGIN');

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // const server = app.getHttpAdapter().getInstance();
  // server.set('trust proxy', 1); // 1 означает доверие первому прокси (Traefik)

  // Настройка версионирования API через URI
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1', // Версия по умолчанию
    prefix: 'api/v', // Префикс для версий: /api/v1/, /api/v2/, etc.
  });

  // Конфигурация Swagger документации
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Placer API')
    .setDescription('<a href="/swagger/json" target="_blank">open api json</a>')
    .setVersion('1.0')
    .build();

  // Создание Swagger документации
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    operationIdFactory: (_controllerKey: string, methodKey: string) => {
      return methodKey; // Использовать имя метода как operationId
    },
  });

  // Настройка Swagger UI
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'swagger/json', // URL для получения JSON схемы
    swaggerOptions: {
      displayOperationId: true, // Показывать operationId в UI
      operationsSorter: 'method', // Сортировать операции по HTTP методам
    },
    customCss:
      '.swagger-ui .opblock .opblock-summary-operation-id { word-break: normal; }',
    customSiteTitle: 'Placer API Docs',
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Запуск HTTP сервера на порту 3000
  await app.listen(3000, '0.0.0.0');
  // console.log('Swagger - http://localhost:3000/api');
}

// Запуск приложения с обработкой ошибок
bootstrap().catch((error) => {
  console.error('Ошибка при запуске приложения:', error);
  process.exit(1);
});
