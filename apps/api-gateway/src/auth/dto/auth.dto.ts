import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, IsUUID, ValidateIf } from "class-validator";
import { IsValidPhoneNumber, TransformPhoneNumber } from "../validators/phone.validator";
import { IAuthResponse } from "../interfaces";
import { UserTwoFactorMethod } from "@app/common/enums";

export class AuthResponse implements IAuthResponse {
  @ApiProperty({ description: "JWT access token" })
  accessToken: string;

  @ApiProperty({ description: "JWT refresh token" })
  refreshToken: string;
}

export class SignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  @TransformPhoneNumber()
  @IsValidPhoneNumber()
  readonly phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  @ValidateIf((obj) => obj.email !== undefined && obj.email !== null && obj.email !== "")
  readonly email?: string;

  @ApiProperty()
  @IsString()
  @ValidateIf((obj) => obj.phoneNumber !== undefined && obj.phoneNumber !== null && obj.phoneNumber !== "")
  readonly phoneNumber?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  currentRefreshToken: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly currentPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  readonly newPassword: string;
}

export class UpdateTwoFactorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  twoFactorEnabled: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserTwoFactorMethod)
  twoFactorMethod: UserTwoFactorMethod;
}

export class RecoverAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly target: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  readonly newPassword: string;
}
