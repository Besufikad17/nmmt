import { validateEnv } from '@app/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { BullBoardModule } from './bull-board/bull-board.module';
import { OtpModule } from './otp/otp.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: validateEnv,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST') || 'redis',
          port: config.get('REDIS_PORT') || 6379,
          password: config.get('REDIS_PASSWORD')
        },
      }),
      inject: [ConfigService],
    }),
    BullBoardModule,
    UserModule,
    RefreshTokenModule,
    AuthModule,
    CommonModule,
    OtpModule
  ],
})
export class AppModule { }
