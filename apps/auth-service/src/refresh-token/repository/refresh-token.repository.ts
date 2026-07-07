import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshToken } from "apps/auth-service/src/refresh-token/entities/refresh-token.entity";
import { IRefreshTokenRepository } from "apps/auth-service/src/refresh-token/interfaces";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, QueryDeepPartialEntity, Repository } from "typeorm";

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken, 'auth') private readonly refreshTokenRepository: Repository<RefreshToken>
  ) { }

  async createRefreshToken(createRefreshTokenArgs: DeepPartial<RefreshToken>): Promise<RefreshToken> {
    const user = this.refreshTokenRepository.create(createRefreshTokenArgs);
    const savedRefreshToken = await this.refreshTokenRepository.save(user);
    return (Array.isArray(savedRefreshToken) ? savedRefreshToken[0] : savedRefreshToken) as RefreshToken;
  }

  async findRefreshTokens(findRefreshTokensArgs: FindManyOptions<RefreshToken>): Promise<RefreshToken[]> {
    return this.refreshTokenRepository.find(findRefreshTokensArgs);
  }

  async findRefreshToken(findRefreshTokenArgs: FindOneOptions<RefreshToken>): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne(findRefreshTokenArgs);
  }

  async updateRefreshToken(updateYserArgs: { where: FindOptionsWhere<RefreshToken>; data: QueryDeepPartialEntity<RefreshToken>; }): Promise<void> {
    await this.refreshTokenRepository.update(updateYserArgs.where, updateYserArgs.data);
  }

  async deleteRefreshToken(id: string): Promise<void> {
    await this.refreshTokenRepository.delete(id);
  }

  async deleteRefreshTokens(deleteRefreshTokensArgs: FindOptionsWhere<RefreshToken>): Promise<void> {
    await this.refreshTokenRepository.delete(deleteRefreshTokensArgs);
  }
}
