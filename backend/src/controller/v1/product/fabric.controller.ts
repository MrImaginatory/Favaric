import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import Fabric from "../../../models/product/fabric.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, updateRecord, getRecord, checkRecordExists } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController, deleteRecordController } from "../base.controller.js";
import { generateMetaTitle, generateMetaDescription, generateMetaKeywords } from "../../../utils/metaData.util.js";
import slugGenerator from "../../../utils/slug.util.js";
import { Op } from "@sequelize/core";

const createFabric = asyncHandler(async (req: Request, res: Response) => {
    const { fabricName, fabricDescription } = req.body;
    const uploadedBy = req.session?.userId;
    const lastModifiedBy = req.session?.userId;
    const fabricSlug = slugGenerator(fabricName);

    const isExist = await checkRecordExists(Fabric, { where: { fabricName, deletedAt: null } });
    if (isExist) {
        throw new AppError(`Fabric ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const metaTitle = generateMetaTitle(fabricName);
    const metaDescription = generateMetaDescription(fabricDescription);
    const metaKeywords = generateMetaKeywords(fabricName);

    const newFabric = await createRecord(Fabric, {
        fabricName,
        fabricSlug,
        fabricDescription,
        metaTitle,
        metaDescription,
        metaKeywords,
        uploadedBy,
        lastModifiedBy
    });

    sendResponse(res, 201, `Fabric ${StatusMessages.CREATED}`, newFabric);
})

const updateFabric = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { fabricName, fabricDescription } = req.body;
    const lastModifiedBy = req.session?.userId;

    const existingFabric = await getRecord(Fabric, { where: { fabricId: id, deletedAt: null } });
    if (!existingFabric) {
        throw new AppError(`Fabric ${StatusMessages.NOT_FOUND}`, 404);
    }

    const isExist = await checkRecordExists(Fabric, {
        where: {
            fabricName,
            fabricId: { [Op.ne]: id }
        }
    });
    if (isExist) {
        throw new AppError(`Fabric ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const metaTitle = generateMetaTitle(fabricName);
    const metaDescription = generateMetaDescription(fabricDescription);
    const metaKeywords = generateMetaKeywords(fabricName);

    await updateRecord(Fabric, {
        fabricName,
        fabricSlug: slugGenerator(fabricName),
        fabricDescription,
        metaTitle,
        metaDescription,
        metaKeywords,
        lastModifiedBy
    }, { where: { fabricId: id } });

    sendResponse(res, 200, `Fabric ${StatusMessages.UPDATED}`, null);
})

const getAllFabrics = getAllRecordsController(Fabric, {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
});

const getFabricById = getRecordByIdController(Fabric, "fabricId", "Fabric", {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
});

const deleteFabric = deleteRecordController(Fabric, "fabricId", "Fabric");

export { createFabric, updateFabric, getAllFabrics, getFabricById, deleteFabric };