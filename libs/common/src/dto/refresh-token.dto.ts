import { IsDate, IsNotEmpty, IsString, IsUUID, ValidateIf } from "class-validator";

export class CreateRefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;

  @IsNotEmpty()
  @IsUUID()
  readonly userId: string;

  @IsNotEmpty()
  @IsDate()
  readonly expiresAt: Date;
}

export class FindRefreshTokenDto {
  @IsString()
  @ValidateIf((obj) => obj.refreshToken !== undefined && obj.refreshToken !== null && obj.refreshToken !== "")
  readonly refreshToken?: string;

  @IsUUID()
  @ValidateIf((obj) => obj.userId !== undefined && obj.userId !== null && obj.userId !== "")
  readonly userId?: string;

  @IsDate()
  @ValidateIf((obj) => obj.expiresAt !== undefined && obj.expiresAt !== null && obj.expiresAt !== "")
  readonly expiresAt?: Date;
}
