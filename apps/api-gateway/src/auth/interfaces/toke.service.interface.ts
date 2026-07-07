import { IUser } from "@app/common/interfaces";

export abstract class ITokenService {
  abstract generateAccessToken(user: IUser): Promise<string>;
  abstract generateRefreshToken(user: IUser, currentRefreshToken?: string, currentRefreshTokenExpiryDate?: Date): Promise<string>;
}
