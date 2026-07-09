import { LoggerService } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { IOtpRepository } from '../interfaces';
import { IApiResponse, IOtpService } from '@app/common/interfaces';
import { RequestOtpDto } from '@app/common/dto';
import { RpcException } from '@nestjs/microservices';
import { OTP_EXPIRY_MINUTES } from '@app/common/constants/strings';
import { hash } from '@app/common/utils/hash.utils';

@Injectable()
export class OtpService implements IOtpService {
  constructor(
    private readonly logger: LoggerService,
    private readonly otpRepository: IOtpRepository
  ) {
    this.logger.setContext(OtpService.name);
  }

  async requestOtp(dto: RequestOtpDto, userId?: string): Promise<IApiResponse<null>> {
    try {
      const expiresAt = new Date(new Date().getMinutes() + OTP_EXPIRY_MINUTES);
      const hashedOtp = await hash();

      await this.otpRepository.createOtp({
        ...dto,
        expiresAt,
        hash: hashedOtp
      });

      return {
        message: 'Otp requested',
        success: true
      };
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
