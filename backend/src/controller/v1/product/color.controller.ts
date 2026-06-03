import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import Color from "../../../models/product/color.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, updateRecord, getRecord } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController, deleteRecordController } from "../base.controller.js";
import slugGenerator from "../../../utils/slug.util.js";

const createColor = asyncHandler(async (req: Request, res: Response) => {
    const { colorName, colorCode } = req.body;

    const colorSlug = slugGenerator(colorName);

    const uploadedBy = req.session?.userId;
    const lastModifiedBy = req.session?.userId;

    const colorExists = await getRecord(Color, { where: { colorName, deletedAt: null } });
    if (colorExists) {
        throw new AppError("Color already exists", 400);
    }

    const colorCodeExists = await getRecord(Color, { where: { colorCode, deletedAt: null } });
    if (colorCodeExists) {
        throw new AppError("Color code already exists", 400);
    }

    const newColor = await createRecord(Color, {
        colorName,
        colorSlug,
        colorCode,
        uploadedBy,
        lastModifiedBy
    });

    sendResponse(res, 201, StatusMessages.SUCCESS, newColor);
});

const getColors = getAllRecordsController(Color, {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
});

const getColorById = getRecordByIdController(Color, "colorId", "Color", {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
});

const updateColor = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { colorName, colorCode } = req.body;

    const lastModifiedBy = req.session?.userId;
    const colorSlug = slugGenerator(colorName);

    const color = await getRecord(Color, { where: { colorId: id } });
    if (!color) {
        throw new AppError("Color not found", 404);
    }

    await updateRecord(Color, {
        colorName,
        colorSlug,
        colorCode,
        lastModifiedBy
    }, { where: { colorId: id } });

    sendResponse(res, 200, StatusMessages.SUCCESS, null);
});

const deleteColor = deleteRecordController(Color, "colorId", "Color");

export { createColor, getColors, getColorById, updateColor, deleteColor };
