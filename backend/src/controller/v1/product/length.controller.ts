import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import Length from "../../../models/product/length.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, updateRecord, getRecord, checkRecordExists } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController, deleteRecordController, searchRecordsController } from "../base.controller.js";
import slugGenerator from "../../../utils/slug.util.js";
import { Op } from "@sequelize/core";

const createLength = asyncHandler(async (req: Request, res: Response) => {
    const { lengthName, lengthDescription, lengthValue } = req.body;
    const uploadedBy = (req as any).user?.userId;
    const lastModifiedBy = (req as any).user?.userId;
    const lengthSlug = slugGenerator(lengthName);

    const isExist = await checkRecordExists(Length, { where: { lengthName, deletedAt: null } });
    if (isExist) {
        throw new AppError(`Length ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const length = await createRecord(Length, {
        lengthName,
        lengthSlug,
        lengthDescription,
        lengthValue,
        uploadedBy,
        lastModifiedBy
    });

    sendResponse(res, 201, `Length ${StatusMessages.CREATED}`, length);
})

const updateLength = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { lengthName, lengthDescription, lengthValue } = req.body;
    const lastModifiedBy = (req as any).user?.userId;
    const lengthSlug = slugGenerator(lengthName);

    const existingLength = await getRecord(Length, { where: { lengthId: id, deletedAt: null } });
    if (!existingLength) {
        throw new AppError(`Length ${StatusMessages.NOT_FOUND}`, 404);
    }

    const isExist = await checkRecordExists(Length, {
        where: {
            lengthName,
            lengthId: { [Op.ne]: id },
            deletedAt: null
        }
    });
    if (isExist) {
        throw new AppError(`Length ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const length = await updateRecord(Length, {
        lengthName,
        lengthSlug,
        lengthDescription,
        lengthValue,
        lastModifiedBy
    }, { where: { lengthId: id } });

    sendResponse(res, 200, `Length ${StatusMessages.UPDATED}`, length);
})

const getLengths = getAllRecordsController(Length, {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
});

const getLengthById = getRecordByIdController(Length, "lengthId", "Length", {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
});

const deleteLength = deleteRecordController(Length, "lengthId", "Length");

const searchLength = searchRecordsController(Length, ["lengthName"], {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
}, "length");

export { createLength, updateLength, getLengths, getLengthById, deleteLength, searchLength };