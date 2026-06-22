import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import Size from "../../../models/product/size.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, updateRecord, getRecord, checkRecordExists } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController, deleteRecordController, searchRecordsController } from "../base.controller.js";
import slugGenerator from "../../../utils/slug.util.js";
import { Op } from "@sequelize/core";

const createSize = asyncHandler(async (req: Request, res: Response) => {
    const { sizeName, sizeValue } = req.body;
    const uploadedBy = (req as any).user?.userId;
    const lastModifiedBy = (req as any).user?.userId;

    const sizeSlug = slugGenerator(sizeName);

    const isExist = await checkRecordExists(Size, { where: { sizeName, sizeSlug, deletedAt: null } });
    if (isExist) {
        throw new AppError(`Size ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const size = await createRecord(Size, {
        sizeName,
        sizeSlug,
        sizeValue,
        uploadedBy,
        lastModifiedBy
    });

    sendResponse(res, 201, `Size ${StatusMessages.CREATED}`, size);
})

const updateSize = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { sizeName, sizeValue } = req.body;
    const lastModifiedBy = (req as any).user?.userId;

    const size = await getRecord(Size, {
        where: {
            sizeId: id,
            deletedAt: null
        }
    })
    if (!size) {
        throw new AppError(`Size ${StatusMessages.NOT_FOUND}`, 404);
    }

    const isExist = await checkRecordExists(Size, {
        where: {
            sizeName,
            sizeId: {
                [Op.ne]: id
            },
            deletedAt: null
        }
    });
    if (isExist) {
        throw new AppError(`Size ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    let sizeSlug = slugGenerator(sizeName ?? size.sizeName);

    const updatedSize = await updateRecord(Size, {
        sizeName,
        sizeSlug,
        sizeValue,
        lastModifiedBy
    }, {
        where: {
            sizeId: id,
            deletedAt: null
        }
    });

    sendResponse(res, 200, `Size ${StatusMessages.UPDATED}`, updatedSize);
})

const getAllSizes = getAllRecordsController(Size, {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
})

const getSizeById = getRecordByIdController(Size, "sizeId", "Size", {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
})

const deleteSize = deleteRecordController(Size, "sizeId", "Size")

const searchSize = searchRecordsController(Size, ["sizeName"], {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
}, "size");

export { createSize, updateSize, getAllSizes, getSizeById, deleteSize, searchSize };