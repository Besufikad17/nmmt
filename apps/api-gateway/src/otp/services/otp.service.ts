import { GetOtpDto, RequestOtpDto, ResendOtpDto, VerifyOtpDto } from '@app/common/dto';
import { IApiResponse, IOtp, IOtpService } from '@app/common/interfaces';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OtpService implements IOtpService {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) { }

  async requestOtp(requestOtpDto: RequestOtpDto, userId?: string): Promise<IApiResponse<null>> {
    try {
      await firstValueFrom(
        this.client.send(
          { cmd: 'requestOtp' },
          { ...requestOtpDto, userId }
        )
      );

      return {
        success: true,
        message: 'Otp requested'
      };
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

  async getOtp(getOtpDto: GetOtpDto): Promise<IOtp | null> {
    try {
      return await firstValueFrom<IOtp | null>(
        this.client.send(
          { cmd: 'getOtp' },
          { ...getOtpDto }
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

  async resendOtp(resendOtpDto: ResendOtpDto, userId?: string): Promise<IApiResponse<null>> {
    try {
      await firstValueFrom<void>(
        this.client.send(
          { cmd: 'resendOtp' },
          { ...resendOtpDto, userId }
        )
      );

      return {
        success: true,
        message: 'Otp resent'
      };
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

  async verifyOtp(verifyOtpDto: VerifyOtpDto, userId?: string): Promise<IApiResponse<null>> {
    try {
      await firstValueFrom<void>(
        this.client.send(
          { cmd: 'verifyOtp' },
          { ...verifyOtpDto, userId }
        )
      );

      return {
        success: true,
        message: 'Otp verified'
      };
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
