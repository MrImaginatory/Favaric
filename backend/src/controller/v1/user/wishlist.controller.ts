import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import { getRecord, createRecord, getAllRecords } from "../../../services/base.service.js";
import Wishlist from "../../../models/users/userWishList.model.js";
import Product from "../../../models/product/product.model.js";

const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const { productId } = req.body;

    const wishlist = await createRecord(Wishlist, {
        userId,
        productId
    });

    return sendResponse(res, 201, StatusMessages.SUCCESS, wishlist);
});

const getWishlist = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;

    const wishlist = await getAllRecords(Wishlist, {
        where: { userId },
        include: [{ model: Product, attributes: ["name", "price", "image"] }]
    });

    return sendResponse(res, 200, StatusMessages.SUCCESS, wishlist);
});

const deleteWishlistItem = asyncHandler(async (req: Request, res: Response) => {
    const { wishlistId } = req.params;
    const userId = (req as any).user?.userId;

    const wishlist = await getRecord(Wishlist, {
        where: { id: wishlistId, userId }
    });

    if (!wishlist) {
        throw new AppError("Wishlist item not found", 404);
    }

    await (wishlist as any).destroy();

    return sendResponse(res, 200, StatusMessages.SUCCESS, { message: "Wishlist item deleted successfully" });
});


export default {
    addToWishlist,
    getWishlist,
    deleteWishlistItem
};