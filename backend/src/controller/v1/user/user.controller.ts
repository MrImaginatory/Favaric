import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import User from "../../../models/users/user.model.js";
import { generateNumericOTP } from "../../../utils/token.util.js";
import bcrypt from "bcryptjs";
import UserSecurity from "../../../models/users/userSecurity.model.js";

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
    const { userId, code, password } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    if (user.resetPasswordToken !== code) {
        throw new AppError("Invalid or expired code", 400);
    }

    const userSecurity: any = await UserSecurity.findByPk(userId);
    if (!userSecurity) {
        throw new AppError("Security credentials not found", 401);
    }

    user.password = await bcrypt.hash(password + userSecurity.pepper + userSecurity.customSalt, 10);
    user.resetPasswordToken = generateNumericOTP(6);
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    return sendResponse(res, 200, StatusMessages.SUCCESS, { message: "Password reset successfully" });
});

const updateForgottenPassword = resetPassword; // Refactored duplicate logic into a reference

const updatePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.session?.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    const userSecurity: any = await UserSecurity.findByPk(userId);
    if (!userSecurity) {
        throw new AppError("Security credentials not found", 401);
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword + userSecurity.pepper + userSecurity.customSalt, user.password);

    if (!isPasswordMatch) {
        throw new AppError("Old password does not match", 400);
    }

    user.password = await bcrypt.hash(newPassword + userSecurity.pepper + userSecurity.customSalt, 10);
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
