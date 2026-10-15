import { Body, Controller, Headers, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { IAuthService } from '../interfaces';
import { AuthResponse, LoginDto, RecoverAccountDto, ResetPasswordDto, SignUpDto, UpdateTwoFactorDto } from '../dto/auth.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiOkResponseWithData } from '@app/config';
import { EmptyBodyResponse } from '@app/common/dto/api-response.dto';
import type { IUser } from '@app/common/interfaces';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RateLimitPolicy } from '../../common/decorators/rate-limit-policy.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private service: IAuthService
  ) { }

  @Post("/signup")
  @ApiOkResponseWithData(EmptyBodyResponse)
  @HttpCode(HttpStatus.CREATED)
  @RateLimitPolicy({
    id: "auth_signup",
    group: "public",
    identityFields: ["email", "phoneNumber"],
    limits: [
      { scope: "ip", limit: 5, windowSec: 60 },
      { scope: "identity", limit: 3, windowSec: 600 },
    ],
  })
  async signUp(
    @Body() dto: SignUpDto
  ) {
    return await this.service.signUp(dto);
  }

  @Post("login")
  @ApiOkResponseWithData(AuthResponse)
  @HttpCode(HttpStatus.OK)
  @RateLimitPolicy({
    id: "auth_login",
    group: "public",
    identityFields: ["email", "phoneNumber"],
    limits: [
      { scope: "ip", limit: 5, windowSec: 60 },
      { scope: "identity", limit: 5, windowSec: 60 },
    ],
    penalty: {
      failureWindowSec: 600,
      steps: [
        { failures: 5, blockSec: 300 },
        { failures: 10, blockSec: 1800 },
        { failures: 20, blockSec: 86400 },
      ],
    },
  })
  async login(
    @Body() dto: LoginDto
  ) {
    return await this.service.login(dto);
  }

  @Post("token/refresh")
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponseWithData(AuthResponse)
  @RateLimitPolicy({
    id: "auth_refresh",
    group: "sensitive",
    limits: [
      { scope: "ip", limit: 30, windowSec: 60 },
      { scope: "user", limit: 30, windowSec: 60 },
    ],
  })
  async refreshTokens(
    @Headers("authorization") auth: string,
    @GetCurrentUser() user: IUser
  ) {
    return await this.service.refreshToken({
      userId: user.id, email: user.phoneNumber!, currentRefreshToken: auth.split(" ")[1]
    });
  }

  @Post("signout")
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponseWithData(EmptyBodyResponse)
  async signOut(
    @GetCurrentUser() user: IUser
  ) {
    return await this.service.signOut(user.id);
  }

  @Post("password/reset")
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponseWithData(EmptyBodyResponse)
  @RateLimitPolicy({
    id: "auth_password_reset",
    group: "sensitive",
    limits: [
      { scope: "ip", limit: 20, windowSec: 60 },
      { scope: "user", limit: 20, windowSec: 60 },
    ],
  })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @GetCurrentUser() user: IUser
  ) {
    return await this.service.resetPassword(dto, user.id);
  }

  @Patch('2fa')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponseWithData(EmptyBodyResponse)
  @RateLimitPolicy({
    id: "auth_update_2fa",
    group: "sensitive",
    limits: [
      { scope: "ip", limit: 20, windowSec: 60 },
      { scope: "user", limit: 20, windowSec: 60 },
    ],
  })
  async updateTwoFactor(
    @Body() dto: UpdateTwoFactorDto,
    @GetCurrentUser() user: IUser
  ) {
    return await this.service.updateTwoFactor(dto, user.id);
  }

  @Post('recover')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponseWithData(EmptyBodyResponse)
  @RateLimitPolicy({
    id: "auth_recover",
    group: "public",
    identityFields: ["value"],
    limits: [
      { scope: "ip", limit: 3, windowSec: 600 },
      { scope: "identity", limit: 3, windowSec: 600 },
    ],
  })
  async recoverAccount(
    @Body() dto: RecoverAccountDto
  ) {
    return await this.service.recoverAccount(dto);
  }
}
