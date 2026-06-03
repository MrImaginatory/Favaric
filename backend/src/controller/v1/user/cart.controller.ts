import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import Cart from "../../../models/users/userCart.model.js";
import Product from "../../../models/product/product.model.js";

const addToCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.session?.userId;
    const { productId, quantity } = req.body;

    const findProduct = await Product.findOne({
        where: { id: productId },
        attributes: ["stock", "maxOrderQty", "minOrderQty"]
    });

    if (!findProduct) {
        throw new AppError("Product not found", 404);
    }

    if (quantity > findProduct.stock) {
        throw new AppError(`Quantity is greater than stock. Stock is ${findProduct.stock}`, 400);
    }

    if (quantity < findProduct.minOrderQty) {
        throw new AppError(`Quantity is less than min order quantity. Min order quantity is ${findProduct.minOrderQty}`, 400);
    }

    if (quantity > findProduct.maxOrderQty) {
        throw new AppError(`Quantity is greater than max order quantity. Max order quantity is ${findProduct.maxOrderQty}`, 400);
    }

    const findCart = await Cart.findOne({
        where: { productId, userId }
    });

    if (findCart) {
        await findCart.update({
            quantity: findCart.quantity + quantity
        })
        return sendResponse(res, 200, StatusMessages.SUCCESS, findCart);
    }

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
        include: [{
            model: Product,
            attributes: ["productName", "regularPrice", "salePrice", "thumbnailImage", "size", "color", "stock"],
        }]
    });

    if (!cart) {
        throw new AppError("Cart not found", 404);
    }

    return sendResponse(res, 200, StatusMessages.SUCCESS, { cart });
});

const updateCart = asyncHandler(async (req: Request, res: Response) => {
    const { cartId } = req.params;
    const userId = req.session?.userId;
    const { productId, quantity } = req.body;

    const findProduct = await Product.findOne({
        where: { id: productId },
        attributes: ["stock", "maxOrderQty", "minOrderQty"]
    });

    if (!findProduct) {
        throw new AppError("Product not found", 404);
    }

    if (quantity > findProduct.stock) {
        throw new AppError(`Quantity is greater than stock. Stock is ${findProduct.stock}`, 400);
    }

    if (quantity < findProduct.minOrderQty) {
        throw new AppError(`Quantity is less than min order quantity. Min order quantity is ${findProduct.minOrderQty}`, 400);
    }

    if (quantity > findProduct.maxOrderQty) {
        throw new AppError(`Quantity is greater than max order quantity. Max order quantity is ${findProduct.maxOrderQty}`, 400);
    }

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