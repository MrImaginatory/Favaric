import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import Dimension from "../../../models/product/dimension.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, updateRecord, getRecord, checkRecordExists } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController, deleteRecordController } from "../base.controller.js";
import slugGenerator from "../../../utils/slug.util.js";
import { Op } from "@sequelize/core";

const createDimension = asyncHandler(async (req: Request, res: Response) => {
    const { dimensionName, dimensionDescription, dimensionLength, dimensionBreadth, dimensionHeight } = req.body;

    const dimensionSlug = slugGenerator(dimensionName);

    const uploadedBy = req.session?.userId;
    const lastModifiedBy = req.session?.userId;

    const isExist = await checkRecordExists(Dimension, { where: { dimensionSlug, deletedAt: null } });

    if (isExist) {
        throw new AppError(`Dimension ${StatusMessages.ALREADY_EXISTS}`, 400);
    }

    const dimension = await createRecord(Dimension, {
        dimensionName,
        dimensionSlug,
        dimensionDescription,
        dimensionLength,
        dimensionBreadth,
        dimensionHeight,
        uploadedBy,
        lastModifiedBy,
    });

    return sendResponse(res, 201, `Dimension ${StatusMessages.CREATED}`, dimension);
});

const updateDimension = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { dimensionName, dimensionDescription, dimensionLength, dimensionBreadth, dimensionHeight } = req.body;

    const dimensionSlug = slugGenerator(dimensionName);

    const lastModifiedBy = req.session?.userId;

    const isExist = await checkRecordExists(Dimension, {
        where: {
            dimensionSlug,
            dimensionId: {
                [Op.ne]: id
            },
            deletedAt: null
        }
    });

    if (isExist) {
        throw new AppError(`Dimension ${StatusMessages.ALREADY_EXISTS}`, 400);
    }

    const dimension = await updateRecord(Dimension, {
        dimensionName,
        dimensionSlug,
        dimensionDescription,
        dimensionLength,
        dimensionBreadth,
        dimensionHeight,
        lastModifiedBy,
    }, { where: { dimensionId: id } });

    return sendResponse(res, 201, `Dimension ${StatusMessages.UPDATED}`, dimension);
});

const getAllDimensions = getAllRecordsController(Dimension, {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
});

const getDimensionById = getRecordByIdController(Dimension, "dimensionId", "Dimension", {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
});

const deleteDimension = deleteRecordController(Dimension, "dimensionId", "Dimension");


export { createDimension, updateDimension, getAllDimensions, getDimensionById, deleteDimension };