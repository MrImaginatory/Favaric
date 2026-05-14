import type { Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.util.js";
import AppError from "../utils/appError.util.js";
import JWTUtil from "../utils/jwt.util.js";
import config from "../configs/constant.config.js";
import User from "../models/users/user.model.js";

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

        // 3. Check if user still exists
        const currentUser = await User.findByPk(decoded.id);
        
        if (!currentUser) {
            throw new AppError("The user belonging to this token no longer exists.", 401);
        }

        // 4. Grant access and store user in request
        req.user = currentUser;
        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            throw new AppError("Your session has expired. Please login again.", 401);
        }
        throw new AppError("Invalid token. Please login again.", 401);
    }
});

export default protect;
