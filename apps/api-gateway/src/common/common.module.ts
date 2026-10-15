import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt.guard';
import { UserModule } from '../user/user.module';
import { JwtRefreshStrategy, JwtStrategy } from './strategies';
import { RateLimitService } from './rate-limit/rate-limit.service';
import { RateLimitStore } from './rate-limit/rate-limit.store';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { RateLimitOutcomeInterceptor } from './interceptors/rate-limit-outcome.interceptor';
import { PaginationInterceptor } from './interceptors/pagination.interceptor';

@Module({
  providers: [
    JwtStrategy,
    JwtRefreshStrategy,
    JwtGuard,
    RateLimitService,
    RateLimitStore,
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimitOutcomeInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PaginationInterceptor,
    }
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
  ],
  exports: [RateLimitService]
})
export class CommonModule { }
