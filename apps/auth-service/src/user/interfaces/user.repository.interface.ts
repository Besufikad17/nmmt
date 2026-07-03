import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, QueryDeepPartialEntity } from "typeorm";
import { User } from "../entities/user.entity";

export abstract class IUserRepository {
  abstract createUser(createUserArgs: DeepPartial<User>): Promise<User>;
  abstract findUsers(findUsersArgs: FindManyOptions<User>): Promise<User[]>;
  abstract findUser(findUserArgs: FindOneOptions<User>): Promise<User | null>;
  abstract updateUser(updateYserArgs: { where: FindOptionsWhere<User>; data: QueryDeepPartialEntity<User>; }): Promise<void>;
  abstract deleteUser(id: string): Promise<void>;
}
