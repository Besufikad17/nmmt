import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, QueryDeepPartialEntity } from "typeorm";
import { RefreshToken } from "../entities/refresh-token.entity";

export abstract class IRefreshTokenRepository {
	abstract createRefreshToken(createRefreshTokenArgs: DeepPartial<RefreshToken>): Promise<RefreshToken>;
	abstract findRefreshTokens(findRefreshTokensArgs: FindManyOptions<RefreshToken>): Promise<RefreshToken[]>;
	abstract findRefreshToken(findRefreshTokenArgs: FindOneOptions<RefreshToken>): Promise<RefreshToken | null>;
	abstract updateRefreshToken(updateRefreshTokenArgs: { where: FindOptionsWhere<RefreshToken>; data: QueryDeepPartialEntity<RefreshToken>; }): Promise<void>;
	abstract deleteRefreshToken(id: string): Promise<void>;
}
