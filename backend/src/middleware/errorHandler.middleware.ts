import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/responseHandler.util.js";
import { StatusMessages } from "../configs/message.config.js";
import logger from "../utils/logger.util.js";

/**
 * Global Error Handler Middleware
 */
export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || StatusMessages.INTERNAL_SERVER_ERROR;

    // Log the error for developers
    logger.error(`[${req.method} ${req.url}] ${err.message}`);
    if (process.env.NODE_ENV === "development") {
        console.error(err);
    }

    return sendResponse(res, err.statusCode, err.message, {
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

export default globalErrorHandler;
