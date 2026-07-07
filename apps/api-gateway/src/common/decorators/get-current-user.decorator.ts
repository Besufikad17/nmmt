import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetCurrentUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request: Express.Request = ctx.switchToHttp().getRequest();
		return request.user;
	},
);
