import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import Cart from "../../../models/users/usercart.model.js";
import Product from "../../../models/product/product.model.js";

const addToCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.session?.userId;
    const { productId, quantity } = req.body;

    const cart = await Cart.create({
        userId,
        productId,
        quantity
    });

    return sendResponse(res, 201, StatusMessages.SUCCESS, cart);
});

const getCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.session?.userId;

    const cart = await Cart.findAll({
        where: { userId },
        include: [{ model: Product, attributes: ["name", "price", "image"] }]
    });

    return sendResponse(res, 200, StatusMessages.SUCCESS, cart);
});

const updateCart = asyncHandler(async (req: Request, res: Response) => {
    const { cartId } = req.params;
    const userId = req.session?.userId;
    const { quantity } = req.body;

    const cart = await Cart.findOne({
        where: { id: cartId, userId }
    });

    if (!cart) {
        throw new AppError("Cart item not found", 404);
    }

    await cart.update({ quantity });

    return sendResponse(res, 200, StatusMessages.SUCCESS, cart);
});

const deleteCart = asyncHandler(async (req: Request, res: Response) => {
    const { cartId } = req.params;
    const userId = req.session?.userId;

    const cart = await Cart.findOne({
        where: { id: cartId, userId }
    });

    if (!cart) {
        throw new AppError("Cart item not found", 404);
    }

    await cart.destroy();

    return sendResponse(res, 200, StatusMessages.SUCCESS, { message: "Cart item deleted successfully" });
});

export default {
    addToCart,
    getCart,
    updateCart,
    deleteCart
};