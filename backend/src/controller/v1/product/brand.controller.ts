import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import Brand from "../../../models/product/brand.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, updateRecord, getRecord, checkRecordExists, deleteRecord } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController, searchRecordsController } from "../base.controller.js";
import { generateMetaTitle, generateMetaDescription, generateMetaKeywords } from "../../../utils/metaData.util.js"
import slugGenerator from "../../../utils/slug.util.js";
import { renameDeletedFile } from "../../../utils/file.util.js";
import { Op } from "@sequelize/core";

const createBrand = asyncHandler(async (req: Request, res: Response) => {
    const { brandName, brandDescription } = req.body;
    const brandLogo = req.file?.filename;

    if (!brandLogo) {
        throw new AppError("Brand Logo is Required", 400);
    }

    const brandSlug = slugGenerator(brandName);
    const metaTitle = generateMetaTitle(brandName);
    const metaDescription = generateMetaDescription(brandDescription);
    const metaKeywords = generateMetaKeywords([brandName]);

    const uploadedBy = (req as any).user?.userId;
    const lastModifiedBy = (req as any).user?.userId;

    const isExist = await checkRecordExists(Brand, { where: { brandName, deletedAt: null } });
    if (isExist) {
        throw new AppError(`Brand ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const newBrand = await createRecord(Brand, {
        brandName,
        brandSlug,
        brandDescription,
        brandLogo,
        metaTitle,
        metaDescription,
        metaKeywords,
        uploadedBy,
        lastModifiedBy
    });

    sendResponse(res, 201, `Brand ${StatusMessages.CREATED}`, newBrand);
});

const updateBrand = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { brandName, brandDescription } = req.body;
    const brandLogo = req.file?.filename;

    const lastModifiedBy = (req as any).user?.userId;

    const brandSlug = brandName ? slugGenerator(brandName) : undefined;
    const metaTitle = brandName ? generateMetaTitle(brandName) : undefined;
    const metaDescription = brandDescription ? generateMetaDescription(brandDescription) : undefined;
    const metaKeywords = brandName ? generateMetaKeywords([brandName]) : undefined;

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

    const updateData: any = {
        lastModifiedBy
    };
    if (brandName) {
        updateData.brandName = brandName;
        updateData.brandSlug = brandSlug;
        updateData.metaTitle = metaTitle;
        updateData.metaKeywords = metaKeywords;
    }
    if (brandDescription) {
        updateData.brandDescription = brandDescription;
        updateData.metaDescription = metaDescription;
    }
    if (brandLogo) {
        updateData.brandLogo = brandLogo;
    }

    if (brandLogo && brand.brandLogo && brandLogo !== brand.brandLogo) {
        await renameDeletedFile(brand.brandLogo);
    }

    await updateRecord(Brand, updateData, { where: { brandId: id } });

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

const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const brand: any = await getRecord(Brand, { where: { brandId: id } as any });
    if (!brand) {
        throw new AppError(`Brand not found`, 404);
    }

    if (brand.brandLogo) {
        await renameDeletedFile(brand.brandLogo);
    }

    await deleteRecord(Brand, "brandId", id);

    sendResponse(res, 200, StatusMessages.SUCCESS, null);
});

const searchBrands = searchRecordsController(Brand, ["brandName"], {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
}, "brand");

export {
    createBrand,
    updateBrand,
    getBrands,
    getBrandById,
    deleteBrand,
    searchBrands
};