import { IApiResponse } from "@app/common/interfaces";
import { LoginDto, RecoverAccountDto, RefreshTokenDto, ResetPasswordDto, SignUpDto, UpdateTwoFactorDto } from "../dto/auth.dto";

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
}

export abstract class IAuthService {
  abstract login(loginDto: LoginDto): Promise<IApiResponse<IAuthResponse>>;
  abstract signUp(signUpDto: SignUpDto): Promise<IApiResponse<null>>;
  abstract refreshToken(refreshTokenDto: RefreshTokenDto): Promise<IApiResponse<IAuthResponse>>;
  abstract signOut(userId: string): Promise<IApiResponse<null>>;
  abstract resetPassword(resetPasswordDto: ResetPasswordDto, userId: string): Promise<IApiResponse<null>>;
  abstract updateTwoFactor(updateTwoFactorDto: UpdateTwoFactorDto, userId: string): Promise<IApiResponse<null>>;
  abstract recoverAccount(recoverAccountDto: RecoverAccountDto): Promise<IApiResponse<null>>;
}
