import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DbModule } from '@app/db';
import { CommonModule } from '@app/common/common.module';
import { validateEnv } from '@app/config';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: validateEnv,
    }),
    CommonModule.forRoot(),
    DbModule.forRoot({
      name: 'auth',
      uri: process.env.AUTH_DATABASE_URI!
    }),
    UserModule,
    RefreshTokenModule,
    OtpModule,
  ]
})
export class AppModule { }
