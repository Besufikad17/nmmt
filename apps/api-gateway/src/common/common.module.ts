import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt.guard';
import { UserModule } from '../user/user.module';
import { JwtRefreshStrategy, JwtStrategy } from './strategies';

@Module({
  providers: [
    JwtStrategy,
    JwtRefreshStrategy,
    JwtGuard
  ],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ]
})
export class CommonModule { }
