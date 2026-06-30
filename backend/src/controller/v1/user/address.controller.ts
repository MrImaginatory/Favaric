import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import Address from "../../../models/users/userAddress.model.js";
import StatusMessages from "../../../configs/message.config.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import { createRecord, getAllRecords, getRecord, updateRecord } from "../../../services/base.service.js";

const addAddress = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const { addressLine1, addressLine2, city, state, postalCode, country } = req.body;

    let defaultAddress = false;

    const findUserAddresses = await Address.count({
        where: { userId }
    });

    if (!findUserAddresses) {
        defaultAddress = true;
    }

    if (findUserAddresses >= 3) {
        throw new AppError("You can only add 3 addresses", 400);
    }

    const address = await createRecord(Address, {
        userId,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        isDefault: defaultAddress
    });

    return sendResponse(res, 201, StatusMessages.SUCCESS, address);
});

const getAddresses = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;

    const addresses = await getAllRecords(Address, {
        where: { userId },
        order: [["createdAt", "DESC"]]
    });

    return sendResponse(res, 200, StatusMessages.SUCCESS, addresses);
});

const getAddressById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    const address = await getRecord(Address, {
        where: { addressId: id, userId }
    });

    if (!address) {
        throw new AppError("Address not found", 404);
    }

    return sendResponse(res, 200, StatusMessages.SUCCESS, address);
});

const updateAddress = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    const { addressLine1, addressLine2, city, state, postalCode, country } = req.body;

    const findAddress = await getRecord(Address, {
        where: { addressId: id, userId }
    });

    if (!findAddress) {
        throw new AppError("Address not found", 404);
    }

    await updateRecord(Address, {
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country
    }, { where: { addressId: id, userId } });

    return sendResponse(res, 200, StatusMessages.SUCCESS, findAddress);
});

const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    const address = await getRecord(Address, {
        where: { addressId: id, userId }
    });

    if (!address) {
        throw new AppError("Address not found", 404);
    }

    // Direct destroy used since deleteRecord deletes by PK and cascades, but we need to ensure userId match.
    // So we just destroy the found record. Or update deleteRecord to take queryOptions.
    await (address as any).destroy();

    return sendResponse(res, 200, StatusMessages.SUCCESS, { message: "Address deleted successfully" });
});

const toggleDefaultAddress = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    await updateRecord(Address, { isDefault: false }, { where: { userId } });

    const address = await getRecord(Address, {
        where: { addressId: id, userId }
    });

    if (!address) {
        throw new AppError("Address not found", 404);
    }

    await updateRecord(Address, { isDefault: true }, { where: { addressId: id, userId } });

    return sendResponse(res, 200, StatusMessages.SUCCESS, address);
});

export default {
    addAddress,
    getAddresses,
    getAddressById,
    updateAddress,
    deleteAddress,
    toggleDefaultAddress
};