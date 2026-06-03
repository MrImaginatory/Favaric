import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import Brand from "../../../models/product/brand.model.js";
import { createRecord, updateRecord, getRecord } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController, deleteRecordController } from "../base.controller.js";
import slugGenerator from "../../../utils/slug.util.js";

const createBrand = asyncHandler(async (req: Request, res: Response) => {
    const { brandName, brandDescription, brandIcon, brandType } = req.body;

    const brandSlug = slugGenerator(brandName);

    const uploadedBy = req.session?.userId;
    const lastModifiedBy = req.session?.userId;

    const newBrand = await createRecord(Brand, {
        brandName,
        brandSlug,
        brandDescription,
        brandIcon,
        brandType,
        uploadedBy,
        lastModifiedBy
    });

    sendResponse(res, 201, StatusMessages.SUCCESS, newBrand);
});

const updateBrand = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { brandName, brandDescription, brandIcon, brandType } = req.body;

    const lastModifiedBy = req.session?.userId;

    const brandSlug = slugGenerator(brandName);

    const brand = await getRecord(Brand, { where: { brandId: id } });
    if (!brand) {
        throw new AppError("Brand not found", 404);
    }

    await updateRecord(Brand, {
        brandName,
        brandDescription,
        brandIcon,
        brandType,
        brandSlug,
        lastModifiedBy
    }, { where: { brandId: id } });

    sendResponse(res, 200, StatusMessages.SUCCESS, null);
});

const getBrands = getAllRecordsController(Brand);

const getBrandById = getRecordByIdController(Brand, "brandId", "Brand");

const deleteBrand = deleteRecordController(Brand, "brandId", "Brand");

export {
    createBrand,
    updateBrand,
    getBrands,
    getBrandById,
    deleteBrand
};