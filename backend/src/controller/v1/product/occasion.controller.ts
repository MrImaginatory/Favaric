import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import Occasion from "../../../models/product/occasion.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, updateRecord, getRecord, checkRecordExists } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController, deleteRecordController } from "../base.controller.js";
import { generateMetaTitle, generateMetaDescription, generateMetaKeywords } from "../../../utils/metaData.util.js";
import slugGenerator from "../../../utils/slug.util.js";
import { Op } from "@sequelize/core";

const createOccasion = asyncHandler(async (req: Request, res: Response) => {
    const { occasionName, occasionDescription, } = req.body;
    const uploadedBy = req.session?.userId;
    const lastModifiedBy = req.session?.userId;

    const occasionSlug = slugGenerator(occasionName);
    const metaTitle = generateMetaTitle(occasionName);
    const metaDescription = generateMetaDescription(occasionName);
    const metaKeywords = generateMetaKeywords(occasionName);

    const isExist = await checkRecordExists(Occasion, { where: { occasionName, occasionSlug, deletedAt: null } });
    if (isExist) {
        throw new AppError(`Occasion ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const occasion = await createRecord(Occasion, {
        occasionName,
        occasionSlug,
        occasionDescription,
        metaTitle,
        metaDescription,
        metaKeywords,
        uploadedBy,
        lastModifiedBy
    });

    sendResponse(res, 201, `Occasion ${StatusMessages.CREATED}`, occasion);
})

const updateOccasion = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { occasionName, occasionDescription } = req.body;
    const lastModifiedBy = req.session?.userId;

    const occasion = await getRecord(Occasion, {
        where: {
            id,
            deletedAt: null
        }
    })
    if (!occasion) {
        throw new AppError(`Occasion ${StatusMessages.NOT_FOUND}`, 404);
    }

    const isExist = await checkRecordExists(Occasion, {
        where: {
            occasionName,
            id: { [Op.ne]: id },
            deletedAt: null
        }
    });
    if (isExist) {
        throw new AppError(`Occasion ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    let occasionSlug = slugGenerator(occasionName ?? occasion.occasionName);
    let metaTitle = generateMetaTitle(occasionName ?? occasion.occasionName);
    let metaDescription = generateMetaDescription(occasionName ?? occasion.occasionName);
    let metaKeywords = generateMetaKeywords(occasionName ?? occasion.occasionName);

    const updatedOccasion = await updateRecord(Occasion, {
        where: {
            id,
            deletedAt: null
        }
    }, {
        occasionName,
        occasionSlug,
        occasionDescription,
        metaTitle,
        metaDescription,
        metaKeywords,
        lastModifiedBy
    });

    sendResponse(res, 200, `Occasion ${StatusMessages.UPDATED}`, updatedOccasion);
})

const getOccasions = getAllRecordsController(Occasion, {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
})

const getOccasionById = getRecordByIdController(Occasion, "id", "Occasion", {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
})

const deleteOccasion = deleteRecordController(Occasion, "id", "Occasion")

export { createOccasion, updateOccasion, getOccasions, getOccasionById, deleteOccasion }
