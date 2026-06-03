import type { Request, Response } from "express";
import type { ModelStatic, Model } from "@sequelize/core";
import asyncHandler from "../../utils/asyncHandler.util.js";
import AppError from "../../utils/appError.util.js";
import sendResponse from "../../utils/responseHandler.util.js";
import StatusMessages from "../../configs/message.config.js";
import { getRecord, getAllRecords, deleteRecord } from "../../services/base.service.js";


export const getRecordByIdController = <T extends Model>(
    model: ModelStatic<T>,
    primaryKeyField: string,
    entityName: string = "Record",
    queryOptions: any = {}
) => asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const options = { ...queryOptions, where: { ...queryOptions.where, [primaryKeyField]: id } as any };
    const record = await getRecord(model, options);

    if (!record) {
        throw new AppError(`${entityName} not found`, 404);
    }

    sendResponse(res, 200, StatusMessages.SUCCESS, record);
});


export const getAllRecordsController = <T extends Model>(
    model: ModelStatic<T>,
    queryOptions: any = {}
) => asyncHandler(async (_req: Request, res: Response) => {
    const records = await getAllRecords(model, queryOptions);
    sendResponse(res, 200, StatusMessages.SUCCESS, records);
});


export const deleteRecordController = <T extends Model>(
    model: ModelStatic<T>,
    primaryKeyField: string,
    entityName: string = "Record"
) => asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const record = await getRecord(model, { where: { [primaryKeyField]: id } as any });
    if (!record) {
        throw new AppError(`${entityName} not found`, 404);
    }

    await deleteRecord(model, primaryKeyField, id);

    sendResponse(res, 200, StatusMessages.SUCCESS, null);
});
