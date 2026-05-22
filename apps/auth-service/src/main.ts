import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { validateEnvByNodeEnv } from 'libs/config';

async function bootstrap() {
  const logger = new Logger('AUTH');

  try {
    validateEnvByNodeEnv(process.env);
  } catch (error) {
    logger.error(error.message, error.stack);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.SERVICE_URL,
      port: parseInt(process.env.AUTH_SERVICE_PORT || '3002', 10),
    },
  });

  await app.startAllMicroservices();
}

bootstrap();
