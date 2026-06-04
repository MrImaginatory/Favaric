import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import ProductType from "../../../models/product/productType.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, updateRecord, getRecord, checkRecordExists } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController, deleteRecordController } from "../base.controller.js";
import { generateMetaTitle, generateMetaDescription, generateMetaKeywords } from "../../../utils/metaData.util.js";
import slugGenerator from "../../../utils/slug.util.js";
import { Op } from "@sequelize/core";


const createProductType = asyncHandler(async (req: Request, res: Response) => {
    const { productTypeName, productTypeDescription } = req.body;
    const uploadedBy = req.session?.userId;
    const lastModifiedBy = req.session?.userId;

    const productTypeSlug = slugGenerator(productTypeName);
    const metaTitle = generateMetaTitle(productTypeName);
    const metaDescription = generateMetaDescription(productTypeName);
    const metaKeywords = generateMetaKeywords(productTypeName);

    const isExist = await checkRecordExists(ProductType, { where: { productTypeName, productTypeSlug, deletedAt: null } });
    if (isExist) {
        throw new AppError(`ProductType ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const productType = await createRecord(ProductType, {
        productTypeName,
        productTypeSlug,
        productTypeDescription,
        metaTitle,
        metaDescription,
        metaKeywords,
        uploadedBy,
        lastModifiedBy
    });

    sendResponse(res, 201, `ProductType ${StatusMessages.CREATED}`, productType);
})

const updateProductType = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { productTypeName, productTypeDescription } = req.body;
    const lastModifiedBy = req.session?.userId;

    const productType = await getRecord(ProductType, {
        where: {
            id,
            deletedAt: null
        }
    })
    if (!productType) {
        throw new AppError(`ProductType ${StatusMessages.NOT_FOUND}`, 404);
    }

    const isExist = await checkRecordExists(ProductType, {
        where: {
            productTypeName,
            id: { [Op.ne]: id },
            deletedAt: null
        }
    });
    if (isExist) {
        throw new AppError(`ProductType ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    let productTypeSlug = slugGenerator(productTypeName ?? productType.productTypeName);
    let metaTitle = generateMetaTitle(productTypeName ?? productType.productTypeName);
    let metaDescription = generateMetaDescription(productTypeName ?? productType.productTypeName);
    let metaKeywords = generateMetaKeywords(productTypeName ?? productType.productTypeName);

    const updatedProductType = await updateRecord(ProductType, {
        where: {
            id,
            deletedAt: null
        }
    }, {
        productTypeName,
        productTypeSlug,
        productTypeDescription,
        metaTitle,
        metaDescription,
        metaKeywords,
        lastModifiedBy
    });

    sendResponse(res, 200, `ProductType ${StatusMessages.UPDATED}`, updatedProductType);
})

const getAllProductTypes = getAllRecordsController(ProductType, {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
})

const getProductTypeById = getRecordByIdController(ProductType, "id", "ProductType", {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
})

const deleteProductType = deleteRecordController(ProductType, "id", "ProductType")

export { createProductType, updateProductType, getAllProductTypes, getProductTypeById, deleteProductType }