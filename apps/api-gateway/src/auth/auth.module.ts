import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { UserModule } from '../user/user.module';
import { IAuthService } from './interfaces';

@Module({
  providers: [
    { provide: IAuthService, useClass: AuthService },
    AuthService
  ],
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
          signOptions: {
            expiresIn:
              configService.get('ACCESS_TOKEN_EXPIRES_IN') || '15m',
          },
        };
      },
    }),
    RefreshTokenModule,
    UserModule
  ]
})
export class AuthModule { }
