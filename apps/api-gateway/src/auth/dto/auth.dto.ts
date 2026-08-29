import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, IsUUID } from "class-validator";
import { IsValidPhoneNumber, TransformPhoneNumber } from "../validators/phone.validator";
import { IAuthResponse } from "../interfaces";

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

export class LoginDto extends SignUpDto { }

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
