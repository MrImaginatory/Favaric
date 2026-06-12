import { Op } from "@sequelize/core";
import type { Response, Request } from "express";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import User from "../../../models/users/user.model.js";
import UserSession from "../../../models/users/userSession.model.js";
import bcrypt from "bcryptjs"
import crypto from "crypto";
import JWTUtil from "../../../utils/jwt.util.js";
import redis from "../../../utils/redis.util.js";
import logger from "../../../utils/logger.util.js";
import UserSecurity from "../../../models/users/userSecurity.model.js";

const signupController = asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, userName, email, password, countryCode, mobile } = req.body

    const existingUser = await User.findOne({
        where: {
            [Op.or]: [
                { email: email.toLowerCase() },
                { userName: userName.toLowerCase() }
            ]
        }
    })

    if (existingUser) {
        if (existingUser.email === email.toLowerCase()) {
            return sendResponse(res, 409, StatusMessages.USER_EMAIL_ALREADY_EXISTS)
        }
        if (existingUser.userName === userName.toLowerCase()) {
            return sendResponse(res, 409, StatusMessages.USER_USERNAME_ALREADY_EXISTS)
        }
    }

    const customSalt = crypto.randomBytes(16).toString("hex");
    const pepper = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(password + pepper + customSalt, 10);

    let user;
    try {
        user = await User.create({
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            email: email,
            password: hashedPassword,
            countryCode: countryCode,
            mobile: mobile,
        });

        await UserSecurity.create({
            userId: user.userId,
            customSalt,
            pepper
        });
    } catch (error) {
        if (user) {
            await user.destroy();
        }
        throw error;
    }

    return sendResponse(res, 201, StatusMessages.USER_CREATED, {
        userName: user.userName,
        email: user.email,
    });
})

const loginController = asyncHandler(async (req: any, res: Response) => {
    const reqBody = req.body

    const user = await User.findOne({
        where: {
            email: reqBody.email.toLowerCase()
        }
    })

    if (!user) {
        throw new AppError(StatusMessages.USER_NOT_FOUND, 404)
    }

    const userSecurity: any = await UserSecurity.findByPk(user.userId);
    if (!userSecurity) {
        throw new AppError("Security credentials not found. Please contact support or sign up again.", 401);
    }

    const isValidPassword = await bcrypt.compare(reqBody.password + userSecurity.pepper + userSecurity.customSalt, user.password);

    if (!isValidPassword) {
        throw new AppError(StatusMessages.AUTH_FAILED, 401)
    }

    // Capture Session Metadata
    const metadata = req.sessionMetadata;

    // Save to Express Session to trigger Redis storage
    req.session.userId = user.userId;
    req.session.userName = user.userName;

    const sessionId = req.sessionID;

    // Store in Postgres
    await UserSession.upsert({
        sessionId: sessionId,
        userId: user.userId,
        userName: user.userName,
        ipAddress: metadata.ip,
        location: metadata.location,
        os: metadata.os,
        userAgent: metadata.userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Match cookie maxAge
    });

    // Redis "100" logic check (as per user request)
    const sessionKeys = await redis.keys("sess:*");
    if (sessionKeys.length >= 100) {
        logger.log("⚠️ Redis session limit (100) reached. Ensuring all sessions are backed up in Postgres.");
    }

    // Generate Tokens
    const accessToken = JWTUtil.generateAccessToken({ id: user.userId });
    const refreshToken = JWTUtil.generateRefreshToken({ id: user.userId });

    // Set Refresh Token in Cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return sendResponse(res, 200, StatusMessages.USER_LOGGED_IN, {
        userName: user.userName,
        email: user.email,
        accessToken,
        refreshToken
    });
})

export default {
    signupController,
    loginController
}