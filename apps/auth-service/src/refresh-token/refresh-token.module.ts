import { Module } from '@nestjs/common';
import { RefreshTokenService } from './services/refresh-token.service';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { DbModule } from '@app/db';
import { RefreshToken } from './entities/refresh-token.entity';
import * as Interface from './interfaces';
import { RefreshTokenController } from './controllers/refresh-token.controller';
import { IRefreshTokenService } from '@app/common/interfaces';

@Module({
  providers: [
    { provide: Interface.IRefreshTokenRepository, useClass: RefreshTokenRepository },
    { provide: IRefreshTokenService, useClass: RefreshTokenService },
    RefreshTokenService
  ],
  imports: [DbModule.forFeatureTypeORM([RefreshToken], 'auth')],
  controllers: [RefreshTokenController]
})
export class RefreshTokenModule { }
