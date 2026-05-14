import type { Response, Request } from "express";
import sendResponse from "../utils/responseHandler.util.js";
import StatusMessages from "../configs/message.config.js";
import sequelize from "../database/database.js";

export const checkHealth = async (_req: Request, res: Response) => {
    return sendResponse(res, 200, StatusMessages.SUCCESS, {
        status: "ok",
    });
}

export const checkDbHealth = async (_req: Request, res: Response) => {
    try {
        await sequelize.authenticate();
        return sendResponse(res, 200, StatusMessages.CONNECTION_SUCCESS, {
            status: "DataBase has been Connected"
        });
    } catch (error: any) {
        return sendResponse(res, 500, StatusMessages.CONNECTION_FAILED, {
            status: "Disconnected",
            error: error.message,
        });
    }
}

