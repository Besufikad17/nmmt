import { HttpStatus, Injectable } from '@nestjs/common';
import { IRefreshTokenRepository } from '../interfaces';
import { LoggerService } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { IRefreshToken, IRefreshTokenService } from '@app/common/interfaces';
import { CreateRefreshTokenDto, FindRefreshTokenDto } from '@app/common/dto';


@Injectable()
export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    private readonly logger: LoggerService,
    private readonly refreshTokenRepository: IRefreshTokenRepository
  ) { }

  async createRefreshToken(createRefreshTokenDto: CreateRefreshTokenDto): Promise<IRefreshToken> {
    try {
      return await this.refreshTokenRepository.createRefreshToken({ ...createRefreshTokenDto });
    } catch (error) {
      this.logger.error(error.message || 'Failed to create user!!');
      throw new RpcException({
        message: 'Failed to create user!!',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        meta: {}
      });
    }
  }

  async findRefreshToken(findRefreshTokenDto: FindRefreshTokenDto): Promise<IRefreshToken | null> {
    try {
      return await this.refreshTokenRepository.findRefreshToken({
        where: { ...findRefreshTokenDto }
      });
    } catch (error) {
      this.logger.error(error.message || 'Failed to create user!!');
      throw new RpcException({
        message: 'Failed to create user!!',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        meta: {}
      });
    }
  }
}
