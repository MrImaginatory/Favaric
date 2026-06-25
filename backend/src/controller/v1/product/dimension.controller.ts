import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import Dimension from "../../../models/product/dimension.model.js";
import Metrics from "../../../models/application/metrics.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, updateRecord, checkRecordExists } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController, deleteRecordController, searchRecordsController } from "../base.controller.js";
import slugGenerator from "../../../utils/slug.util.js";
import { Op } from "@sequelize/core";

const dimensionIncludes = [
    { model: User, as: "uploader", attributes: ["userName"] },
    { model: User, as: "modifier", attributes: ["userName"] },
    { model: Metrics, as: "metric", attributes: ["metricId", "metricName"] },
];

const createDimension = asyncHandler(async (req: Request, res: Response) => {
    const { dimensionName, dimensionDescription, dimensionLength, dimensionBreadth, dimensionHeight, metricId } = req.body;

    const dimensionSlug = slugGenerator(dimensionName);

    const uploadedBy = (req as any).user?.userId;
    const lastModifiedBy = (req as any).user?.userId;

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
        metricId,
        uploadedBy,
        lastModifiedBy,
    });

    return sendResponse(res, 201, `Dimension ${StatusMessages.CREATED}`, dimension);
});

const updateDimension = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { dimensionName, dimensionDescription, dimensionLength, dimensionBreadth, dimensionHeight, metricId } = req.body;

    const dimensionSlug = slugGenerator(dimensionName);

    const lastModifiedBy = (req as any).user?.userId;

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

    if (!isExist) {
        throw new AppError(`Dimension ${StatusMessages.NOT_FOUND}`, 404);
    }

    const dimension = await updateRecord(Dimension, {
        dimensionName,
        dimensionSlug,
        dimensionDescription,
        dimensionLength,
        dimensionBreadth,
        dimensionHeight,
        metricId,
        lastModifiedBy,
    }, { where: { dimensionId: id } });

    return sendResponse(res, 201, `Dimension ${StatusMessages.UPDATED}`, dimension);
});

const getAllDimensions = getAllRecordsController(Dimension, { include: dimensionIncludes });

const getDimensionById = getRecordByIdController(Dimension, "dimensionId", "Dimension", { include: dimensionIncludes });

const deleteDimension = deleteRecordController(Dimension, "dimensionId", "Dimension");

const searchDimensions = searchRecordsController(Dimension, ["dimensionName"], { include: dimensionIncludes }, "dimension");

export { createDimension, updateDimension, getAllDimensions, getDimensionById, deleteDimension, searchDimensions };