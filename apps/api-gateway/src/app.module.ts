import { validateEnv } from '@app/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { BullBoardModule } from './bull-board/bull-board.module';

@Module({
  imports: [
    BullBoardModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: validateEnv,
    }),
    UserModule,
    RefreshTokenModule,
    AuthModule,
    CommonModule,
  ]
})
export class AppModule { }
