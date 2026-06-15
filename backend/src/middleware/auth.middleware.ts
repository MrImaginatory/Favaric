import type { Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.util.js";
import AppError from "../utils/appError.util.js";
import JWTUtil from "../utils/jwt.util.js";
import config from "../configs/constant.config.js";
import User from "../models/users/user.model.js";
import redis from "../utils/redis.util.js";
import UserSession from "../models/users/userSession.model.js";

/**
 * Middleware to protect routes and ensure the user is authenticated.
 */
export const protect = asyncHandler(async (req: any, _res: Response, next: NextFunction) => {
    let token: string | undefined;

    // 1. Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        throw new AppError("You are not logged in. Please login to get access.", 401);
    }

    try {
        // 2. Verify token
        const decoded = JWTUtil.verifyToken(token, config.JWT.SECRET);

        // 3. Verify session exists
        if (!decoded.sessionId) {
            throw new AppError("Invalid token format. Please login again.", 401);
        }

        const sessionExistsInRedis = await redis.exists(`sess:${decoded.sessionId}`);
        let isSessionValid = sessionExistsInRedis > 0;

        if (!isSessionValid) {
            // Fallback to Postgres
            const sessionInDb = await UserSession.findOne({ where: { sessionId: decoded.sessionId } });
            if (sessionInDb) {
                isSessionValid = true;
            }
        }

        if (!isSessionValid) {
            throw new AppError("Your session has been terminated. Please login again.", 401);
        }

        // 4. Check if user still exists
        const currentUser = await User.findByPk(decoded.id);
        
        if (!currentUser) {
            throw new AppError("The user belonging to this token no longer exists.", 401);
        }

        // 5. Grant access and store user/session info in request
        req.user = currentUser;
        req.sessionId = decoded.sessionId;
        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            throw new AppError("Your session has expired. Please login again.", 401);
        }
        throw new AppError("Invalid token. Please login again.", 401);
    }
});

export default protect;
