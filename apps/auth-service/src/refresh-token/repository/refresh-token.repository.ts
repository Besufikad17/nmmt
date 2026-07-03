import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshToken } from "apps/auth-service/src/refresh-token/entities/refresh-token.entity";
import { IRefreshTokenRepository } from "apps/auth-service/src/refresh-token/interfaces";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, QueryDeepPartialEntity, Repository } from "typeorm";

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken, 'auth') private readonly userRepository: Repository<RefreshToken>
  ) { }

  async createRefreshToken(createRefreshTokenArgs: DeepPartial<RefreshToken>): Promise<RefreshToken> {
    const user = this.userRepository.create(createRefreshTokenArgs);
    const savedRefreshToken = await this.userRepository.save(user);
    return (Array.isArray(savedRefreshToken) ? savedRefreshToken[0] : savedRefreshToken) as RefreshToken;
  }

  async findRefreshTokens(findRefreshTokensArgs: FindManyOptions<RefreshToken>): Promise<RefreshToken[]> {
    return this.userRepository.find(findRefreshTokensArgs);
  }

  async findRefreshToken(findRefreshTokenArgs: FindOneOptions<RefreshToken>): Promise<RefreshToken | null> {
    return this.userRepository.findOne(findRefreshTokenArgs);
  }

  async updateRefreshToken(updateYserArgs: { where: FindOptionsWhere<RefreshToken>; data: QueryDeepPartialEntity<RefreshToken>; }): Promise<void> {
    this.userRepository.update(updateYserArgs.where, updateYserArgs.data);
  }

  async deleteRefreshToken(id: string): Promise<void> {
    this.userRepository.delete(id);
  }
}
