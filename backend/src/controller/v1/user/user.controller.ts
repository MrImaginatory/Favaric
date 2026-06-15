import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import User from "../../../models/users/user.model.js";
import { generateOTP } from "../../../utils/otp.util.js";
import redis from "../../../utils/redis.util.js";
import mailer from "../../../utils/mailer.util.js";
import { getPasswordResetEmailTemplate, getPasswordUpdatedEmailTemplate } from "../../../templates/email.template.js";
import bcrypt from "bcryptjs";
import UserSecurity from "../../../models/users/userSecurity.model.js";
import config from "../../../configs/constant.config.js";

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
    
    // Add uploaded file path to update data if a file was uploaded
    if (req.file) {
        updateData.profilePicture = req.file.path.replace(/\\/g, '/');
    }

    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    await user.update(updateData);
    return sendResponse(res, 200, StatusMessages.SUCCESS, user);
});

const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    
    if (!user) {
        throw new AppError("User not found", 404);
    }

    const cooldownKey = `pwd_reset_cooldown:${user.userId}`;
    const ttl = await redis.ttl(cooldownKey);
    
    if (ttl > 0) {
        throw new AppError(`Please wait ${ttl} seconds before requesting a new OTP.`, 429);
    }

    const otp = generateOTP(6);
    const otpKey = `pwd_reset_otp:${user.userId}`;

    await redis.set(otpKey, otp, { EX: 300 }); // 5 minutes
    await redis.set(cooldownKey, "1", { EX: 180 }); // 3 minutes

    const emailHtml = getPasswordResetEmailTemplate(user.userName, otp);

    const emailSent = await mailer.sendEmail(
        user.email,
        "Password Reset OTP",
        emailHtml
    );

    if (!emailSent) {
        await redis.del(otpKey);
        await redis.del(cooldownKey);
        throw new AppError("Failed to send email. Please try again later.", 500);
    }

    return sendResponse(res, 200, StatusMessages.SUCCESS, { 
        message: "OTP sent successfully to your email",
        userId: user.userId 
    });
});

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { userId, code, password } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    
    const storedOtp = await redis.get(`pwd_reset_otp:${userId}`);
    if (!storedOtp || storedOtp !== code) {
        throw new AppError("Invalid or expired code", 400);
    }

    const userSecurity: any = await UserSecurity.findByPk(userId);
    if (!userSecurity) {
        throw new AppError("Security credentials not found", 401);
    }

    user.password = await bcrypt.hash(password + userSecurity.pepper + userSecurity.customSalt, 10);
    user.resetPasswordToken = null as any;
    user.resetPasswordExpires = null as any;

    await user.save();

    await redis.del(`pwd_reset_otp:${userId}`);
    await redis.del(`pwd_reset_cooldown:${userId}`);

    // Send confirmation email
    const time = new Date().toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC';
    const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
    const supportUrl = config.WEBSITE_URL + '/support';
    const emailHtml = getPasswordUpdatedEmailTemplate(user.userName, time, deviceInfo, supportUrl);
    
    // We don't need to await the email to avoid blocking the response, or we can await it depending on preference.
    // Awaiting ensures we know if it failed, but not strictly necessary for confirmation emails.
    await mailer.sendEmail(user.email, "Password Updated Successfully", emailHtml);

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

    // Send confirmation email
    const time = new Date().toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC';
    const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
    const supportUrl = config.WEBSITE_URL + '/support';
    const emailHtml = getPasswordUpdatedEmailTemplate(user.userName, time, deviceInfo, supportUrl);
    
    await mailer.sendEmail(user.email, "Password Updated Successfully", emailHtml);

    return sendResponse(res, 200, StatusMessages.SUCCESS, { message: "Password updated successfully" });
});

export default {
    getUserProfile,
    updateProfile,
    forgotPassword,
    resetPassword,
    updateForgottenPassword,
    updatePassword
};
