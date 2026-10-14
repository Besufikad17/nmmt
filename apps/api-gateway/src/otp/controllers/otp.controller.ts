import { RequestOtpDto, ResendOtpDto, VerifyOtpDto } from '@app/common/dto';
import { EmptyBodyResponse } from '@app/common/dto/api-response.dto';
import { ApiOkResponseWithData } from '@app/config';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OtpService } from '../services/otp.service';

@Controller('otp')
export class OtpController {
  constructor(
    private service: OtpService
  ) { }

  @Post('request')
  @ApiOkResponseWithData(EmptyBodyResponse)
  @HttpCode(HttpStatus.CREATED)
  async requestOtp(
    @Body() dto: RequestOtpDto
  ) {
    return await this.service.requestOtp(dto);
  }

  @Post('resend')
  @ApiOkResponseWithData(EmptyBodyResponse)
  @HttpCode(HttpStatus.CREATED)
  async resendOtp(
    @Body() dto: ResendOtpDto
  ) {
    return await this.service.resendOtp(dto);
  }

  @Post('verify')
  @ApiOkResponseWithData(EmptyBodyResponse)
  @HttpCode(HttpStatus.ACCEPTED)
  async verifyOtp(
    @Body() dto: VerifyOtpDto
  ) {
    return await this.service.verifyOtp(dto);
  }
}
