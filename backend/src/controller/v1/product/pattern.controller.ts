import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import Pattern from "../../../models/product/pattern.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, updateRecord, getRecord, checkRecordExists } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController, deleteRecordController } from "../base.controller.js";
import { generateMetaTitle, generateMetaDescription, generateMetaKeywords } from "../../../utils/metaData.util.js";
import slugGenerator from "../../../utils/slug.util.js";
import { Op } from "@sequelize/core";


const createPattern = asyncHandler(async (req: Request, res: Response) => {
    const { patternName, patternDescription } = req.body;
    const uploadedBy = req.session?.userId;
    const lastModifiedBy = req.session?.userId;

    const patternSlug = slugGenerator(patternName);
    const metaTitle = generateMetaTitle(patternName);
    const metaDescription = generateMetaDescription(patternName);
    const metaKeywords = generateMetaKeywords(patternName);

    const isExist = await checkRecordExists(Pattern, { where: { patternName, patternSlug, deletedAt: null } });
    if (isExist) {
        throw new AppError(`Pattern ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const pattern = await createRecord(Pattern, {
        patternName,
        patternSlug,
        patternDescription,
        metaTitle,
        metaDescription,
        metaKeywords,
        uploadedBy,
        lastModifiedBy
    });

    sendResponse(res, 201, `Pattern ${StatusMessages.CREATED}`, pattern);
})

const updatePattern = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { patternName, patternDescription } = req.body;
    const lastModifiedBy = req.session?.userId;

    const pattern = await getRecord(Pattern, {
        where: {
            id,
            deletedAt: null
        }
    })
    if (!pattern) {
        throw new AppError(`Pattern ${StatusMessages.NOT_FOUND}`, 404);
    }

    const isExist = await checkRecordExists(Pattern, {
        where: {
            patternName,
            id: { [Op.ne]: id },
            deletedAt: null
        }
    });
    if (isExist) {
        throw new AppError(`Pattern ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    let patternSlug = slugGenerator(patternName ?? pattern.patternName);
    let metaTitle = generateMetaTitle(patternName ?? pattern.patternName);
    let metaDescription = generateMetaDescription(patternName ?? pattern.patternName);
    let metaKeywords = generateMetaKeywords(patternName ?? pattern.patternName);

    const updatedPattern = await updateRecord(Pattern, {
        where: {
            id,
            deletedAt: null
        }
    }, {
        patternName,
        patternSlug,
        patternDescription,
        metaTitle,
        metaDescription,
        metaKeywords,
        lastModifiedBy
    });

    sendResponse(res, 200, `Pattern ${StatusMessages.UPDATED}`, updatedPattern);
})

const getAllPatterns = getAllRecordsController(Pattern, {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
})

const getPatternById = getRecordByIdController(Pattern, "id", "Pattern", {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
})

const deletePattern = deleteRecordController(Pattern, "id", "Pattern")

export { createPattern, updatePattern, getAllPatterns, getPatternById, deletePattern }