import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
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
