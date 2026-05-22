import { CreateUserDto } from "../dto/user.dto";
import { User } from "../entities/user.entity";

export abstract class IUserService {
  abstract createUser(createUserDto: CreateUserDto): Promise<User>;
}
