import { Body, Controller, Headers, HttpCode, HttpException, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { IAuthService } from '../interfaces';
import { AuthResponse, LoginDto, ResetPasswordDto, SignUpDto, UpdateTwoFactorDto } from '../dto/auth.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiOkResponseWithData } from '@app/config';
import { EmptyBodyResponse } from '@app/common/dto/api-response.dto';
import type { IUser } from '@app/common/interfaces';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { JwtGuard } from '../../common/guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private service: IAuthService
  ) { }

  @Post("/signup")
  @ApiOkResponseWithData(EmptyBodyResponse)
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() dto: SignUpDto
  ) {
    return await this.service.signUp(dto);
  }

  @Post("login")
  @ApiOkResponseWithData(AuthResponse)
  @HttpCode(HttpStatus.OK)
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
  async updateTwoFactor(
    @Body() dto: UpdateTwoFactorDto,
    @GetCurrentUser() user: IUser
  ) {
    return await this.service.updateTwoFactor(dto, user.id);
  }
}
