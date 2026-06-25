import type { Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import UserSession from "../../../models/users/userSession.model.js";
import redis from "../../../utils/redis.util.js";
import StatusMessages from "../../../configs/message.config.js";
import AppError from "../../../utils/appError.util.js";
import { decrementSessionCount } from "../../../services/cache.service.js";

const getActiveSessions = asyncHandler(async (req: any, res: Response) => {
    const userId = req.user?.userId; // Assuming user info is in req.user from auth middleware
    
    const sessions = await UserSession.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]]
    });

    return sendResponse(res, 200, StatusMessages.SUCCESS, sessions);
});

const terminateSession = asyncHandler(async (req: any, res: Response) => {
    const { sessionId } = req.params;
    const userId = req.user?.userId;

    const session = await UserSession.findOne({
        where: { sessionId, userId }
    });

    if (!session) {
        throw new AppError("Session not found", 404);
    }

    // Delete from Redis
    await redis.del(`sess:${sessionId}`);

    // Delete from Postgres
    await session.destroy();

    await decrementSessionCount();

    return sendResponse(res, 200, StatusMessages.SUCCESS, { message: "Session terminated" });
});

export default {
    getActiveSessions,
    terminateSession
};
