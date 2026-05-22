import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, QueryDeepPartialEntity, Repository } from "typeorm";
import { IUserRepository } from "../interfaces/user.repository.interface";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User, 'auth') private readonly userRepository: Repository<User>
  ) { }

  async createUser(createUserArgs: DeepPartial<User>): Promise<User> {
    const user = this.userRepository.create(createUserArgs);
    const savedUser = await this.userRepository.save(user);
    return (Array.isArray(savedUser) ? savedUser[0] : savedUser) as User;
  }

  async findUsers(findUsersArgs: FindManyOptions<User>): Promise<User[]> {
    return this.userRepository.find(findUsersArgs);
  }

  async findUser(findUserArgs: FindOneOptions<User>): Promise<User | null> {
    return this.userRepository.findOne(findUserArgs);
  }

  async updateUser(updateYserArgs: { where: FindOptionsWhere<User>; data: QueryDeepPartialEntity<User>; }): Promise<void> {
    this.userRepository.update(updateYserArgs.where, updateYserArgs.data);
  }

  async deleteUser(id: string): Promise<void> {
    this.userRepository.delete(id);
  }
}
