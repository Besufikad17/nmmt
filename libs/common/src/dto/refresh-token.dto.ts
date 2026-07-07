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

export class FindRefreshTokensDto {
  @IsUUID()
  @ValidateIf((obj) => obj.userId !== undefined && obj.userId !== null && obj.userId !== "")
  readonly userId?: string;
}

export class FindRefreshTokenDto extends FindRefreshTokensDto {
  @IsString()
  @ValidateIf((obj) => obj.refreshToken !== undefined && obj.refreshToken !== null && obj.refreshToken !== "")
  readonly refreshToken?: string;

  @IsDate()
  @ValidateIf((obj) => obj.expiresAt !== undefined && obj.expiresAt !== null && obj.expiresAt !== "")
  readonly expiresAt?: Date;
}

export class DeleteRefreshTokensDto extends FindRefreshTokensDto { }
