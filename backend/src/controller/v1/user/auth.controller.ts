import type { Response, Request, NextFunction } from "express";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import sequelize from "../../../database/database.js";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import User from "../../../models/users/user.model.js";
import bcrypt from "bcryptjs"

const signupController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const reqBody = req.body

    const user = await User.create({
        email: reqBody.email,
        password: bcrypt.hashSync(reqBody.password, 10),
        name: reqBody.name,
    })

    return sendResponse(res, 201, StatusMessages.USER_CREATED, {
        userId: user.userId,
        email: user.email
    });
})

export default {
    signupController
}