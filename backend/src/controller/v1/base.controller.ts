import type { Request, Response } from "express";
import { type ModelStatic, type Model, Op } from "@sequelize/core";
import asyncHandler from "../../utils/asyncHandler.util.js";
import AppError from "../../utils/appError.util.js";
import sendResponse from "../../utils/responseHandler.util.js";
import StatusMessages from "../../configs/message.config.js";
import { getRecord, getAllRecords, deleteRecord } from "../../services/base.service.js";


export const getRecordByIdController = <T extends Model>(
    model: ModelStatic<T>,
    primaryKeyField: keyof T,
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
    queryOptions: any = {},
    defaultLimit: number = 1000,
    cursorField: string = "createdAt"
) => asyncHandler(async (req: Request, res: Response) => {
    let options = { ...queryOptions };

    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : defaultLimit;
    if (!isNaN(limit) && limit > 0) {
        options.limit = limit;
    }

    const cursor = req.query.cursor;
    if (cursor) {
        options.where = {
            ...options.where,
            [cursorField]: {
                [Op.lt]: cursor
            }
        };
    }

    if (!options.order) {
        options.order = [[cursorField, "DESC"]];
    }

    const records = await getAllRecords(model, options);

    let nextCursor = null;
    if (records.length > 0 && records.length === options.limit) {
        nextCursor = (records[records.length - 1] as any)[cursorField];
    }

    sendResponse(res, 200, StatusMessages.SUCCESS, { records, nextCursor });
});

export const searchRecordsController = <T extends Model>(
    model: ModelStatic<T>,
    searchFields: string[],
    queryOptions: any = {},
    queryParamName: string = "q",
    defaultLimit: number = 100,
    cursorField: string = "createdAt"
) => asyncHandler(async (req: Request, res: Response) => {
    const q = req.query[queryParamName];

    let options = { ...queryOptions };

    if (q && typeof q === "string") {
        const searchCondition = {
            [Op.or]: searchFields.map((field) => ({
                [field]: {
                    [Op.like]: `%${q}%`,
                },
            })),
        };

        options.where = {
            ...options.where,
            ...searchCondition,
        };
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : defaultLimit;
    if (!isNaN(limit) && limit > 0) {
        options.limit = limit;
    }

    const cursor = req.query.cursor;
    if (cursor) {
        options.where = {
            ...options.where,
            [cursorField]: {
                [Op.lt]: cursor
            }
        };
    }

    if (!options.order) {
        options.order = [[cursorField, "DESC"]];
    }

    const records = await getAllRecords(model, options);

    let nextCursor = null;
    if (records.length > 0 && records.length === options.limit) {
        nextCursor = (records[records.length - 1] as any)[cursorField];
    }

    sendResponse(res, 200, StatusMessages.SUCCESS, { records, nextCursor });
});


export const deleteRecordController = <T extends Model>(
    model: ModelStatic<T>,
    primaryKeyField: keyof T,
    entityName: string = "Record"
) => asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const record = await getRecord(model, { where: { [primaryKeyField]: id } as any });
    if (!record) {
        throw new AppError(`${entityName} not found`, 404);
    }

    await deleteRecord(model, primaryKeyField as string, id);

    sendResponse(res, 200, StatusMessages.SUCCESS, null);
});
