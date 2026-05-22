import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DbModule } from 'lib/db';
import { CommonModule } from 'lib/common/common.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from 'libs/config';

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
    UserModule
  ]
})
export class AppModule { }
