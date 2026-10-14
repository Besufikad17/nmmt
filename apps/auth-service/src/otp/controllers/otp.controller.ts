import { Controller } from '@nestjs/common';
import { OtpService } from '../services/otp.service';
import { MessagePattern } from '@nestjs/microservices';
import { GetOtpDto, RequestOtpDto } from '@app/common/dto';

@Controller('otp')
export class OtpController {
  constructor(private otpService: OtpService) { }

  @MessagePattern({ cmd: 'requestOtp' })
  async requestOtp(requestOtpDto: RequestOtpDto) {
    return await this.otpService.requestOtp(requestOtpDto);
  }

  @MessagePattern({ cmd: 'getOtp' })
  async getOtp(getOtpDto: GetOtpDto) {
    return await this.otpService.getOtp(getOtpDto);
  }
}
