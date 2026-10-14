import { Controller } from '@nestjs/common';
import { OtpService } from '../services/otp.service';
import { MessagePattern } from '@nestjs/microservices';
import { GetOtpDto, RequestOtpDto, ResendOtpDto, VerifyOtpDto } from '@app/common/dto';

@Controller('otp')
export class OtpController {
  constructor(private otpService: OtpService) { }

  @MessagePattern({ cmd: 'requestOtp' })
  async requestOtp(requestOtpDto: RequestOtpDto, userId?: string) {
    return await this.otpService.requestOtp(requestOtpDto, userId);
  }

  @MessagePattern({ cmd: 'getOtp' })
  async getOtp(getOtpDto: GetOtpDto) {
    return await this.otpService.getOtp(getOtpDto);
  }

  @MessagePattern({ cmd: 'resendOtp' })
  async resendOtp(resendOtpDto: ResendOtpDto, userId?: string) {
    return await this.otpService.resendOtp(resendOtpDto, userId);
  }

  @MessagePattern({ cmd: 'verifyOtp' })
  async verifyOtp(verifyOtpDto: VerifyOtpDto, userId?: string) {
    return await this.otpService.verifyOtp(verifyOtpDto, userId);
  }
}
