export interface JwtPayload {
	sub: string;
	phoneNumber: string;
	tokenVersion: number;
	iat?: number;
	exp?: number;
}

export interface User {
	id: string;
}

export interface JwtUser {
	user: User;
}
