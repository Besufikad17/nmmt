import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../interfaces";

export function decodeToken(token: string): JwtPayload {
	return jwtDecode<JwtPayload>(token);
}
