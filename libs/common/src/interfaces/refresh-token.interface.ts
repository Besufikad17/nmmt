import { CreateRefreshTokenDto, FindRefreshTokenDto } from "../dto/refresh-token.dto";

export interface IRefreshToken {
	id: string;
	userId: string;
	refreshToken: string;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

export abstract class IRefreshTokenService {
	abstract createRefreshToken(createRefreshTokenDto: CreateRefreshTokenDto): Promise<IRefreshToken>;
	abstract findRefreshToken(findRefreshTokenDto: FindRefreshTokenDto): Promise<IRefreshToken | null>;
}