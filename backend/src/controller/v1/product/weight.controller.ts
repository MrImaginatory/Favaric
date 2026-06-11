import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import Weight from "../../../models/product/weight.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, updateRecord, getRecord, checkRecordExists } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController, deleteRecordController } from "../base.controller.js";
import slugGenerator from "../../../utils/slug.util.js";
import { Op } from "@sequelize/core";

const createWeight = asyncHandler(async (req: Request, res: Response) => {
    const { weightName, weightValue } = req.body;
    const uploadedBy = req.session?.userId;
    const lastModifiedBy = req.session?.userId;

    const weightSlug = slugGenerator(weightName);

    const isExist = await checkRecordExists(Weight, { where: { weightName, weightSlug, deletedAt: null } });
    if (isExist) {
        throw new AppError(`Weight ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const weight = await createRecord(Weight, {
        weightName,
        weightSlug,
        weightValue,
        uploadedBy,
        lastModifiedBy
    });

    sendResponse(res, 201, `Weight ${StatusMessages.CREATED}`, weight);
})

const updateWeight = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { weightName, weightValue } = req.body;
    const lastModifiedBy = req.session?.userId;

    const weight = await getRecord(Weight, {
        where: {
            weightId: id,
            deletedAt: null
        }
    })
    if (!weight) {
        throw new AppError(`Weight ${StatusMessages.NOT_FOUND}`, 404);
    }

    const isExist = await checkRecordExists(Weight, {
        where: {
            weightName,
            weightId: {
                [Op.ne]: id
            },
            deletedAt: null
        }
    });
    if (isExist) {
        throw new AppError(`Weight ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    let weightSlug = slugGenerator(weightName ?? weight.weightName);

    const updatedWeight = await updateRecord(Weight, {
        weightName,
        weightSlug,
        weightValue,
        lastModifiedBy
    }, {
        where: {
            weightId: id,
            deletedAt: null
        }
    });

    sendResponse(res, 200, `Weight ${StatusMessages.UPDATED}`, updatedWeight);
})

const getAllWeights = getAllRecordsController(Weight, {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
})

const getWeightById = getRecordByIdController(Weight, "weightId", "Weight", {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
})

const deleteWeight = deleteRecordController(Weight, "weightId", "Weight")

export { createWeight, updateWeight, getAllWeights, getWeightById, deleteWeight }
