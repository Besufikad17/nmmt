import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { validateEnvByNodeEnv } from '@app/config';

async function bootstrap() {
  const logger = new Logger('NOTIFICATION');

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
      port: parseInt(process.env.NOTIFICATION_SERVICE_PORT || '3003', 10),
    },
  });

  await app.startAllMicroservices();
}

bootstrap();
