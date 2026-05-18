import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import Wishlist from "../../../models/users/userWishList.model.js";
import Product from "../../../models/product/product.model.js";

const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.session?.userId;
    const { productId } = req.body;

    const wishlist = await Wishlist.create({
        userId,
        productId
    });

    return sendResponse(res, 201, StatusMessages.SUCCESS, wishlist);
});

const getWishlist = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.session?.userId;

    const wishlist = await Wishlist.findAll({
        where: { userId },
        include: [{ model: Product, attributes: ["name", "price", "image"] }]
    });

    return sendResponse(res, 200, StatusMessages.SUCCESS, wishlist);
});

const deleteWishlistItem = asyncHandler(async (req: Request, res: Response) => {
    const { wishlistId } = req.params;
    const userId = req.session?.userId;

    const wishlist = await Wishlist.findOne({
        where: { id: wishlistId, userId }
    });

    if (!wishlist) {
        throw new AppError("Wishlist item not found", 404);
    }

    await wishlist.destroy();

    return sendResponse(res, 200, StatusMessages.SUCCESS, { message: "Wishlist item deleted successfully" });
});


export default {
    addToWishlist,
    getWishlist,
    deleteWishlistItem
};