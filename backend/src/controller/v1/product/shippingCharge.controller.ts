import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import ShippingCharge from "../../../models/product/shippingCharge.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, updateRecord, getRecord, checkRecordExists } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController, deleteRecordController } from "../base.controller.js";
import { Op } from "@sequelize/core";


const createShippingCharge = asyncHandler(async (req: Request, res: Response) => {
    const { shippingBaseCountry, shippingPrice, isFreeShipping, shippingMinimumOrderAmount, shippingWeightSlabFrom, shippingWeightSlabTo, shippingStatus } = req.body;

    const uploadedBy = req.session?.userId;
    const lastModifiedBy = req.session?.userId;


    const isExist = await checkRecordExists(ShippingCharge, { where: { shippingBaseCountry, deletedAt: null } });
    if (isExist) {
        throw new AppError(`ShippingCharge ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const shippingCharge = await createRecord(ShippingCharge, {
        shippingBaseCountry,
        shippingPrice,
        isFreeShipping,
        shippingMinimumOrderAmount,
        shippingWeightSlabFrom,
        shippingWeightSlabTo,
        shippingStatus,
        uploadedBy,
        lastModifiedBy
    });

    sendResponse(res, 201, `ShippingCharge ${StatusMessages.CREATED}`, shippingCharge);
})

const updateShippingCharge = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { shippingBaseCountry, shippingPrice, isFreeShipping, shippingMinimumOrderAmount, shippingWeightSlabFrom, shippingWeightSlabTo, shippingStatus } = req.body;
    const lastModifiedBy = req.session?.userId;

    const shippingCharge = await getRecord(ShippingCharge, {
        where: {
            id,
            deletedAt: null
        }
    })
    if (!shippingCharge) {
        throw new AppError(`ShippingCharge ${StatusMessages.NOT_FOUND}`, 404);
    }

    const isExist = await checkRecordExists(ShippingCharge, {
        where: {
            shippingBaseCountry,
            id: { [Op.ne]: id },
            deletedAt: null
        }
    });
    if (isExist) {
        throw new AppError(`ShippingCharge ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const updatedShippingCharge = await updateRecord(ShippingCharge, {
        where: {
            id,
            deletedAt: null
        }
    }, {
        shippingBaseCountry,
        shippingPrice,
        isFreeShipping,
        shippingMinimumOrderAmount,
        shippingWeightSlabFrom,
        shippingWeightSlabTo,
        shippingStatus,
        lastModifiedBy
    });

    sendResponse(res, 200, `ShippingCharge ${StatusMessages.UPDATED}`, updatedShippingCharge);
})

const getAllShippingCharges = getAllRecordsController(ShippingCharge, {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
})

const getShippingChargeById = getRecordByIdController(ShippingCharge, "id", "ShippingCharge", {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
})

const deleteShippingCharge = deleteRecordController(ShippingCharge, "id", "ShippingCharge")

export { createShippingCharge, updateShippingCharge, getAllShippingCharges, getShippingChargeById, deleteShippingCharge }