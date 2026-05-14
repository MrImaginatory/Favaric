import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import User from "../../../models/users/user.model.js";
import { generateNumericOTP } from "../../../utils/token.util.js";
import bcrypt from "bcryptjs";

const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.session?.userId;
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return sendResponse(res, 200, StatusMessages.SUCCESS, user);
});

const updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.session?.userId;
    const updateData = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    await user.update(updateData);
    return sendResponse(res, 200, StatusMessages.SUCCESS, user);
});

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { userId, code } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    if (user.resetPasswordToken !== code) {
        throw new AppError("Invalid or expired code", 400);
    }
    user.password = req.body.password;
    user.resetPasswordToken = generateNumericOTP(6);
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    return sendResponse(res, 200, StatusMessages.SUCCESS, { message: "Password reset successfully" });

});

const updateForgottenPassword = asyncHandler(async (req: Request, res: Response) => {
    const { userId, code } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    if (user.resetPasswordToken !== code) {
        throw new AppError("Invalid or expired code", 400);
    }
    user.password = req.body.password;
    user.resetPasswordToken = generateNumericOTP(6);
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    return sendResponse(res, 200, StatusMessages.SUCCESS, { message: "Password reset successfully" });

});

const updatePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.session?.userId;

    const { password } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new AppError("Password does not match", 400);
    }
    user.password = password;
    await user.save();

    return sendResponse(res, 200, StatusMessages.SUCCESS, { message: "Password updated successfully" });

});

export default {
    getUserProfile,
    updateProfile,
    resetPassword,
    updateForgottenPassword,
    updatePassword
};
