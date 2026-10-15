import { RequestOtpDto, ResendOtpDto, VerifyOtpDto } from '@app/common/dto';
import { EmptyBodyResponse } from '@app/common/dto/api-response.dto';
import { ApiOkResponseWithData } from '@app/config';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OtpService } from '../services/otp.service';
import { RateLimitPolicy } from '../../common/decorators/rate-limit-policy.decorator';

@Controller('otp')
export class OtpController {
  constructor(
    private service: OtpService
  ) { }

  @Post('request')
  @ApiOkResponseWithData(EmptyBodyResponse)
  @HttpCode(HttpStatus.CREATED)
  @RateLimitPolicy({
    id: "otp_request",
    group: "public",
    identityFields: ["value", "userId"],
    limits: [
      { scope: "ip", limit: 3, windowSec: 600 },
      { scope: "identity", limit: 3, windowSec: 600 },
    ],
  })
  async requestOtp(
    @Body() dto: RequestOtpDto
  ) {
    return await this.service.requestOtp(dto);
  }

  @Post('resend')
  @ApiOkResponseWithData(EmptyBodyResponse)
  @HttpCode(HttpStatus.CREATED)
  @RateLimitPolicy({
    id: "otp_resend",
    group: "public",
    identityFields: ["value", "userId"],
    limits: [
      { scope: "ip", limit: 3, windowSec: 600 },
      { scope: "identity", limit: 3, windowSec: 600 },
    ],
  })
  async resendOtp(
    @Body() dto: ResendOtpDto
  ) {
    return await this.service.resendOtp(dto);
  }

  @Post('verify')
  @ApiOkResponseWithData(EmptyBodyResponse)
  @HttpCode(HttpStatus.ACCEPTED)
  @RateLimitPolicy({
    id: "otp_verify",
    group: "public",
    identityFields: ["value", "userId"],
    limits: [
      { scope: "ip", limit: 10, windowSec: 600 },
      { scope: "identity", limit: 10, windowSec: 600 },
    ],
    penalty: {
      failureWindowSec: 600,
      steps: [
        { failures: 10, blockSec: 600 },
        { failures: 20, blockSec: 3600 },
        { failures: 30, blockSec: 86400 },
      ],
    },
  })
  async verifyOtp(
    @Body() dto: VerifyOtpDto
  ) {
    return await this.service.verifyOtp(dto);
  }
}
