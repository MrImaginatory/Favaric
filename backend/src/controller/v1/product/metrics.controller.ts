import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import Metrics from "../../../models/application/metrics.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, updateRecord, checkRecordExists } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController, deleteRecordController, searchRecordsController } from "../base.controller.js";
import { Op } from "@sequelize/core";

const createMetric = asyncHandler(async (req: Request, res: Response) => {
    const { metricName } = req.body;
    const uploadedBy = (req as any).user?.userId;
    const lastModifiedBy = (req as any).user?.userId;

    const isExist = await checkRecordExists(Metrics, { where: { metricName, deletedAt: null } });
    if (isExist) {
        throw new AppError(`Metric ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const metric = await createRecord(Metrics, {
        metricName,
        uploadedBy,
        lastModifiedBy,
    });

    return sendResponse(res, 201, `Metric ${StatusMessages.CREATED}`, metric);
});

const updateMetric = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { metricName } = req.body;
    const lastModifiedBy = (req as any).user?.userId;

    const isExist = await checkRecordExists(Metrics, {
        where: {
            metricName,
            metricId: { [Op.ne]: id },
            deletedAt: null
        }
    });
    if (isExist) {
        throw new AppError(`Metric ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const metric = await updateRecord(Metrics, {
        metricName,
        lastModifiedBy,
    }, { where: { metricId: id } });

    return sendResponse(res, 200, `Metric ${StatusMessages.UPDATED}`, metric);
});

const getMetricById = getRecordByIdController(Metrics, "metricId", "Metric", {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
});

const getAllMetrics = getAllRecordsController(Metrics, {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
});

const deleteMetric = deleteRecordController(Metrics, "metricId", "Metric");

const searchMetric = searchRecordsController(Metrics, ["metricName"], {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
}, "metric");

export { createMetric, updateMetric, getMetricById, getAllMetrics, deleteMetric, searchMetric };
