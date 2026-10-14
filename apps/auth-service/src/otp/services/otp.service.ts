import { LoggerService } from '@app/common';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IOtpRepository } from '../interfaces';
import { IApiResponse, IOtp, IOtpService } from '@app/common/interfaces';
import { GetOtpDto, RequestOtpDto, ResendOtpDto, VerifyOtpDto } from '@app/common/dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { BCRYPT_ROUNDS, OTP_EXPIRY_MINUTES, OTP_LENGTH } from '@app/common/constants/strings';
import { compare, hash } from '@app/common/utils/hash.utils';
import { randomInt } from 'node:crypto';
import { firstValueFrom } from 'rxjs';
import { NotificationType, OtpChannel, OtpStatus } from '@app/common/enums';
import { addMinutes } from '@app/common/utils/time.utils';

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
      const expiresAt = new Date(addMinutes(new Date(), OTP_EXPIRY_MINUTES));
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
            message: `Verify ${purpose.replaceAll('_', ' ').toLowerCase()} action with this otp code ${otp}`
          }
        ),
        { defaultValue: undefined }
      );

      return {
        message: 'Otp requested',
        success: true
      };
    } catch (error) {
      this.logger.error(error.message || 'Failed to create otp!!');
      throw new RpcException({
        message: 'Failed to create otp!!',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        meta: {}
      });
    }
  }

  async getOtp(dto: GetOtpDto): Promise<IOtp | null> {
    try {
      return await this.otpRepository.findOtp({
        where: { ...dto },
        order: { updatedAt: 'desc' }
      });
    } catch (error) {
      this.logger.error(error.message || 'Failed to fetch otp!!');
      throw new RpcException({
        message: 'Failed to create user!!',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        meta: {}
      });
    }
  }

  async resendOtp(resendOtpDto: ResendOtpDto, userId?: string): Promise<IApiResponse<null>> {
    try {
      return await this.requestOtp(resendOtpDto, userId);
    } catch (error) {
      this.logger.error(error.message || 'Failed to resend otp!!');
      throw new RpcException({
        message: 'Failed to resend otp!!',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        meta: {}
      });
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto, userId?: string): Promise<IApiResponse<null>> {
    try {
      const { otpCode, purpose, target } = verifyOtpDto;
      const otp = await this.otpRepository.findOtp({
        where: {
          purpose,
          target,
          ...(userId ? { userId } : {})
        },
        order: {
          updatedAt: 'desc'
        }
      });

      if (!otp) {
        throw new RpcException({
          message: "Invalid code!!",
          statusCode: HttpStatus.BAD_REQUEST,
          meta: {}
        });
      }

      if (otp.attempts <= 0) {
        throw new RpcException({
          message: "You have reached maximum trial!!",
          statusCode: HttpStatus.BAD_REQUEST,
          meta: {}
        });
      }

      if (otp.expiresAt <= new Date()) {
        await this.otpRepository.updateOtp({
          where: { id: otp.id },
          data: { status: OtpStatus.EXPIRED }
        });

        throw new RpcException({
          message: "OTP expired!!",
          statusCode: HttpStatus.BAD_REQUEST,
          meta: {}
        });
      }

      const otpMatch: boolean = await compare(otpCode, otp.hash);
      if (!otpMatch) {
        await this.otpRepository.updateOtp({
          where: { id: otp.id },
          data: { attempts: otp.attempts - 1 }
        });

        throw new RpcException({
          message: "Invalid code!!",
          statusCode: HttpStatus.BAD_REQUEST,
          meta: {}
        });
      }

      if (otp.status !== OtpStatus.PENDING) {
        throw new RpcException({
          message: `OTP has ${otp.status.toLowerCase()}!!`,
          statusCode: HttpStatus.BAD_REQUEST,
          meta: {}
        });
      }

      await this.otpRepository.updateOtp({
        where: { id: otp.id },
        data: { status: OtpStatus.VERIFIED }
      });

      return {
        success: true,
        message: "Verification completed"
      };
    } catch (error) {
      this.logger.error(error.message || 'Failed to verify otp!!');
      throw new RpcException({
        message: 'Failed to verify otp!!',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        meta: {}
      });
    }
  }
}
