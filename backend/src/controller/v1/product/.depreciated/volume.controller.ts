/// <reference types="express-session" />
/// <reference path="../../../../types/express-session.d.ts" />
import type { Request, Response } from "express";
import asyncHandler from "../../../../utils/asyncHandler.util.js";
import AppError from "../../../../utils/appError.util.js";
import sendResponse from "../../../../utils/responseHandler.util.js";
import StatusMessages from "../../../../configs/message.config.js";
import User from "../../../../models/users/user.model.js";
import { createRecord, updateRecord, getRecord, checkRecordExists } from "../../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController, deleteRecordController } from "../../base.controller.js";
import slugGenerator from "../../../../utils/slug.util.js";
import { Op } from "@sequelize/core";
import Volume from "../../../../models/product/.depreciated/volume.model.js";

const createVolume = asyncHandler(async (req: Request, res: Response) => {
    const { volumeName, volumeValue } = req.body;
    const uploadedBy = (req as any).user?.userId;
    const lastModifiedBy = (req as any).user?.userId;

    const volumeSlug = slugGenerator(volumeName);

    const isExist = await checkRecordExists(Volume, { where: { volumeName, volumeSlug, deletedAt: null } });
    if (isExist) {
        throw new AppError(`Volume ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const volume = await createRecord(Volume, {
        volumeName,
        volumeSlug,
        volumeValue,
        uploadedBy,
        lastModifiedBy
    });

    sendResponse(res, 201, `Volume ${StatusMessages.CREATED}`, volume);
})

const updateVolume = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { volumeName, volumeValue } = req.body;
    const lastModifiedBy = (req as any).user?.userId;

    const volume = await getRecord(Volume, {
        where: {
            id,
            deletedAt: null
        }
    })
    if (!volume) {
        throw new AppError(`Volume ${StatusMessages.NOT_FOUND}`, 404);
    }

    const isExist = await checkRecordExists(Volume, {
        where: {
            volumeName,
            id: {
                [Op.ne]: id
            },
            deletedAt: null
        }
    });
    if (isExist) {
        throw new AppError(`Volume ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    let volumeSlug = slugGenerator(volumeName ?? volume.volumeName);

    const updatedVolume = await updateRecord(Volume, {
        where: {
            id,
            deletedAt: null
        }
    }, {
        volumeName,
        volumeSlug,
        volumeValue,
        lastModifiedBy
    });

    sendResponse(res, 200, `Volume ${StatusMessages.UPDATED}`, updatedVolume);
})

const getAllVolumes = getAllRecordsController(Volume, {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
})

const getVolumeById = getRecordByIdController(Volume, "id", "Volume", {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
})

const deleteVolume = deleteRecordController(Volume, "id", "Volume")

export { createVolume, updateVolume, getAllVolumes, getVolumeById, deleteVolume }