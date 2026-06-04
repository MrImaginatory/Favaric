import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import Brand from "../../../models/product/brand.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, updateRecord, getRecord, checkRecordExists } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController, deleteRecordController } from "../base.controller.js";
import slugGenerator from "../../../utils/slug.util.js";
import { Op } from "@sequelize/core";

const createBrand = asyncHandler(async (req: Request, res: Response) => {
    const { brandName, brandDescription, brandIcon, brandType } = req.body;

    const brandSlug = slugGenerator(brandName);

    const uploadedBy = req.session?.userId;
    const lastModifiedBy = req.session?.userId;

    const isExist = await checkRecordExists(Brand, { where: { brandName, deletedAt: null } });
    if (isExist) {
        throw new AppError(`Brand ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const newBrand = await createRecord(Brand, {
        brandName,
        brandSlug,
        brandDescription,
        brandIcon,
        brandType,
        uploadedBy,
        lastModifiedBy
    });

    sendResponse(res, 201, `Brand ${StatusMessages.CREATED}`, newBrand);
});

const updateBrand = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { brandName, brandDescription, brandIcon, brandType } = req.body;

    const lastModifiedBy = req.session?.userId;

    const brandSlug = slugGenerator(brandName);

    const brand = await getRecord(Brand, { where: { brandId: id, deletedAt: null } });
    if (!brand) {
        throw new AppError(`Brand ${StatusMessages.NOT_FOUND}`, 404);
    }

    const isExist = await checkRecordExists(Brand, {
        where: {
            brandName,
            brandId: { [Op.ne]: id },
            deletedAt: null
        }
    });
    if (isExist) {
        throw new AppError(`Brand ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    await updateRecord(Brand, {
        brandName,
        brandDescription,
        brandIcon,
        brandType,
        brandSlug,
        lastModifiedBy
    }, { where: { brandId: id } });

    sendResponse(res, 200, `Brand ${StatusMessages.UPDATED}`, null);
});

const getBrands = getAllRecordsController(Brand, {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
});

const getBrandById = getRecordByIdController(Brand, "brandId", "Brand", {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
});

const deleteBrand = deleteRecordController(Brand, "brandId", "Brand");

export {
    createBrand,
    updateBrand,
    getBrands,
    getBrandById,
    deleteBrand
};