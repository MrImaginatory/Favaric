import type { Response } from "express";

export const sendResponse = (
    res: Response,
    statusCode: number,
    message: string,
    data: any = null
) => {
    const success = statusCode >= 200 && statusCode < 300;

    return res.status(statusCode).json({
        success,
        message,
        data,
    });
};

export default sendResponse;
