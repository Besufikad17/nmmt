import { LoggerService } from '@app/common';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IOtpRepository } from '../interfaces';
import { IApiResponse, IOtpService } from '@app/common/interfaces';
import { RequestOtpDto } from '@app/common/dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { BCRYPT_ROUNDS, OTP_EXPIRY_MINUTES, OTP_LENGTH } from '@app/common/constants/strings';
import { hash } from '@app/common/utils/hash.utils';
import { randomInt } from 'node:crypto';
import { firstValueFrom } from 'rxjs';
import { NotificationType, OtpChannel } from '@app/common/enums';

@Injectable()
export class OtpService implements IOtpService {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private client: ClientProxy,
    private readonly logger: LoggerService,
    private readonly otpRepository: IOtpRepository
  ) {
    this.logger.setContext(OtpService.name);
  }

  async requestOtp(dto: RequestOtpDto, userId?: string): Promise<IApiResponse<null>> {
    try {
      const expiresAt = new Date(new Date().getMinutes() + OTP_EXPIRY_MINUTES);
      const otp = randomInt(0, 10 ** OTP_LENGTH)
        .toString()
        .padStart(OTP_LENGTH, '0');
      const hashedOtp = await hash(otp, BCRYPT_ROUNDS);

      await this.otpRepository.createOtp({
        ...dto,
        expiresAt,
        hash: hashedOtp
      });

      const { target, channel, purpose } = dto;
      await firstValueFrom(
        this.client.send<unknown>(
          { cmd: 'createNotification' },
          {
            target,
            userId,
            type: channel === OtpChannel.EMAIL ?
              NotificationType.EMAIL : NotificationType.SMS,
            title: purpose,
            message: `Verify ${purpose.replaceAll('_', ' ').toLowerCase()} action`
          }
        )
      );

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
