import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/responseHandler.util.js";
import { StatusMessages } from "../configs/message.config.js";
import logger from "../utils/logger.util.js";
import fs from "fs";

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

    // Cleanup uploaded files if an error occurred
    const cleanupFile = (filePath: string) => {
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr && unlinkErr.code !== 'ENOENT') {
                logger.error(`Failed to delete orphaned file ${filePath}: ${unlinkErr.message}`);
            } else if (!unlinkErr) {
                logger.log(`Deleted orphaned file: ${filePath}`);
            }
        });
    };

    if (req.file && req.file.path) {
        cleanupFile(req.file.path);
    }

    if (req.files) {
        if (Array.isArray(req.files)) {
            req.files.forEach((file: any) => {
                if (file.path) cleanupFile(file.path);
            });
        } else {
            Object.values(req.files).forEach((fileArray: any) => {
                if (Array.isArray(fileArray)) {
                    fileArray.forEach((file: any) => {
                        if (file.path) cleanupFile(file.path);
                    });
                }
            });
        }
    }

    return sendResponse(res, err.statusCode, err.message, {
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

export default globalErrorHandler;
