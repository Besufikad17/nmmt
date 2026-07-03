import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@app/common';
import { setupSwagger } from '@app/config';
import { validateEnvByNodeEnv } from '@app/config';

async function bootstrap() {
  const logger = new Logger('API_GATEWAY');

  try {
    validateEnvByNodeEnv(process.env);
  } catch (error) {
    logger.error(error.message, error.stack);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api';
  app.setGlobalPrefix(apiPrefix);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS
  const corsConfig = configService.get('app.cors');
  app.enableCors(corsConfig);

  // Swagger documentation (dev only, or if ENABLE_SWAGGER=true)
  setupSwagger(app);

  const port = parseInt(process.env.API_SERVER_PORT || process.env.PORT || '3000', 10);
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}/${apiPrefix}`);
}

bootstrap();
