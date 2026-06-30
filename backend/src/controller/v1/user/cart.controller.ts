import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import { getRecord, createRecord, getAllRecords, updateRecord } from "../../../services/base.service.js";
import Cart from "../../../models/users/userCart.model.js";
import Product from "../../../models/product/product.model.js";

const addToCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const { productId, quantity } = req.body;

    const findProduct = await getRecord(Product, {
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

    const findCart = await getRecord(Cart, {
        where: { productId, userId }
    });

    if (findCart) {
        await updateRecord(Cart, {
            quantity: findCart.quantity + quantity
        }, { where: { productId, userId } });
        return sendResponse(res, 200, StatusMessages.SUCCESS, findCart);
    }

    const cart = await createRecord(Cart, {
        userId,
        productId,
        quantity
    });

    return sendResponse(res, 201, StatusMessages.SUCCESS, cart);
});

const getCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;

    const cart = await getAllRecords(Cart, {
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
    const userId = (req as any).user?.userId;
    const { productId, quantity } = req.body;

    const findProduct = await getRecord(Product, {
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

    const cart = await getRecord(Cart, {
        where: { cartId, userId }
    });

    if (!cart) {
        throw new AppError("Cart item not found", 404);
    }

    await updateRecord(Cart, { quantity }, { where: { cartId, userId } });

    return sendResponse(res, 200, StatusMessages.SUCCESS, cart);
});

const deleteCart = asyncHandler(async (req: Request, res: Response) => {
    const { cartId } = req.params;
    const userId = (req as any).user?.userId;

    const cart = await getRecord(Cart, {
        where: { cartId, userId }
    });

    if (!cart) {
        throw new AppError("Cart item not found", 404);
    }

    await (cart as any).destroy();

    return sendResponse(res, 200, StatusMessages.SUCCESS, { message: "Cart item deleted successfully" });
});

export default {
    addToCart,
    getCart,
    updateCart,
    deleteCart
};