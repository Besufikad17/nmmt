import { CreateRefreshTokenDto, DeleteRefreshTokensDto, FindRefreshTokenDto, FindRefreshTokensDto } from '@app/common/dto';
import { IRefreshToken, IRefreshTokenService } from '@app/common/interfaces';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RefreshTokenService implements IRefreshTokenService {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) { }

  async createRefreshToken(createRefreshTokenDto: CreateRefreshTokenDto): Promise<IRefreshToken> {
    try {
      return firstValueFrom(
        this.client.send<IRefreshToken>(
          { cmd: 'createRefreshToken' },
          { ...createRefreshTokenDto }
        )
      );
    } catch (error) {
      console.error('Error: ', error);
      if (error instanceof HttpException) {
        throw error;
      } else if (error.statusCode && error.message) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new HttpException(
          'An unexpected error occurred.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async findRefreshToken(findRefreshTokenDto: FindRefreshTokenDto): Promise<IRefreshToken | null> {
    try {
      return firstValueFrom(
        this.client.send<IRefreshToken | null>(
          { cmd: 'findRefreshToken' },
          { ...findRefreshTokenDto }
        )
      );
    } catch (error) {
      console.error('Error: ', error);
      if (error instanceof HttpException) {
        throw error;
      } else if (error.statusCode && error.message) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new HttpException(
          'An unexpected error occurred.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async findRefreshTokens(findRefreshTokensDto: FindRefreshTokensDto): Promise<IRefreshToken[]> {
    try {
      return firstValueFrom(
        this.client.send<IRefreshToken[]>(
          { cmd: 'findRefreshTokens' },
          { ...findRefreshTokensDto }
        )
      );
    } catch (error) {
      console.error('Error: ', error);
      if (error instanceof HttpException) {
        throw error;
      } else if (error.statusCode && error.message) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new HttpException(
          'An unexpected error occurred.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async deleteRefreshTokens(deleteRefreshTokensDto: DeleteRefreshTokensDto): Promise<void> {
    try {
      await firstValueFrom(
        this.client.send(
          { cmd: 'deleteRefreshTokens' },
          { ...deleteRefreshTokensDto }
        )
      );
    } catch (error) {
      console.error('Error: ', error);
      if (error instanceof HttpException) {
        throw error;
      } else if (error.statusCode && error.message) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new HttpException(
          'An unexpected error occurred.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
}
