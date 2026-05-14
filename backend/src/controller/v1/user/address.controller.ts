import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import Address from "../../../models/users/userAddress.model.js";
import StatusMessages from "../../../configs/message.config.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import AppError from "../../../utils/appError.util.js";

const addAddress = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.session?.userId;
    const addressData = req.body;

    const address = await Address.create({
        userId,
        ...addressData
    });

    return sendResponse(res, 201, StatusMessages.SUCCESS, address);
});

const getAddresses = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.session?.userId;

    const addresses = await Address.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]]
    });

    return sendResponse(res, 200, StatusMessages.SUCCESS, addresses);
});

const updateAddress = asyncHandler(async (req: Request, res: Response) => {
    const { addressId } = req.params;
    const userId = req.session?.userId;
    const updateData = req.body;

    const address = await Address.findOne({
        where: { id: addressId, userId }
    });

    if (!address) {
        throw new AppError("Address not found", 404);
    }

    await address.update(updateData);

    return sendResponse(res, 200, StatusMessages.SUCCESS, address);
});

const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
    const { addressId } = req.params;
    const userId = req.session?.userId;

    const address = await Address.findOne({
        where: { id: addressId, userId }
    });

    if (!address) {
        throw new AppError("Address not found", 404);
    }

    await address.destroy();

    return sendResponse(res, 200, StatusMessages.SUCCESS, { message: "Address deleted successfully" });
});

const toggleDefaultAddress = asyncHandler(async (req: Request, res: Response) => {
    const { addressId } = req.params;
    const userId = req.session?.userId;

    // First, unset all as default
    await Address.update({ isDefault: false }, { where: { userId } });

    // Then set the specific one as default
    const address = await Address.findOne({
        where: { id: addressId, userId }
    });

    if (!address) {
        throw new AppError("Address not found", 404);
    }

    await address.update({ isDefault: true });

    return sendResponse(res, 200, StatusMessages.SUCCESS, address);
});

export default {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    toggleDefaultAddress
};