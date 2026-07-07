import { IUser } from "@app/common/interfaces";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
	constructor() {
		super();
	}

	handleRequest<TUser = IUser>(err: Error, user: TUser): TUser {
		if (err || !user || !(user as unknown as IUser)) {
			throw new UnauthorizedException("Unauthorized");
		}
		return user;
	}
}
