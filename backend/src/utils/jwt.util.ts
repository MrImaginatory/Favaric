import jwt from "jsonwebtoken";
import config from "../configs/constant.config.js";


class JWTUtil {

    public static generateAccessToken(payload: object): string {
        return jwt.sign(payload, config.JWT.SECRET, {
            expiresIn: "15m",
        });
    }

    public static generateRefreshToken(payload: object): string {
        return jwt.sign(payload, config.JWT.REFRESH_SECRET, {
            expiresIn: "7d",
        });
    }

    public static verifyToken(token: string, secret: string): any {
        return jwt.verify(token, secret);
    }
}

export default JWTUtil;
