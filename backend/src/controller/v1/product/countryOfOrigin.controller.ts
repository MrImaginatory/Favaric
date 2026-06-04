import type { Request, Response } from "express";
import { Op } from "@sequelize/core";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import CountryOfOrigin from "../../../models/product/countryOfOrigin.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, updateRecord, getRecord, checkRecordExists } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController, deleteRecordController } from "../base.controller.js";
import slugGenerator from "../../../utils/slug.util.js";
import { generateMetaTitle, generateMetaDescription, generateMetaKeywords } from "../../../utils/metaData.util.js";

const createCountryOrigin = asyncHandler(async (req: Request, res: Response) => {
    const { countryName, countryDescription } = req.body;

    const countrySlug = slugGenerator(countryName);
    const metaTitle = generateMetaTitle(countryName);
    const metaDescription = generateMetaDescription(countryDescription);
    const metaKeywords = generateMetaKeywords([countryName]);

    const uploadedBy = req.session?.userId;
    const lastModifiedBy = req.session?.userId;

    const isExist = await checkRecordExists(CountryOfOrigin, { where: { countryName, deletedAt: null } });
    if (isExist) {
        throw new AppError(`Country ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const newCountry = await createRecord(CountryOfOrigin, {
        countryName,
        countrySlug,
        countryDescription,
        metaTitle,
        metaDescription,
        metaKeywords,
        uploadedBy,
        lastModifiedBy
    });

    sendResponse(res, 201, `Country ${StatusMessages.CREATED}`, newCountry);
})

const updateCountryOrigin = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { countryName, countryDescription } = req.body;

    const countrySlug = slugGenerator(countryName);
    const metaTitle = generateMetaTitle(countryName);
    const metaDescription = generateMetaDescription(countryDescription);
    const metaKeywords = generateMetaKeywords([countryName]);

    const lastModifiedBy = req.session?.userId;

    const country = await getRecord(CountryOfOrigin, { where: { countryOfOriginId: id, deletedAt: null } });
    if (!country) {
        throw new AppError(`Country ${StatusMessages.NOT_FOUND}`, 404);
    }

    const isExist = await checkRecordExists(CountryOfOrigin, {
        where: {
            countryName,
            countryOfOriginId: { [Op.ne]: id },
            deletedAt: null
        }
    });
    if (isExist) {
        throw new AppError(`Country ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    await updateRecord(CountryOfOrigin, {
        countryName,
        countrySlug,
        countryDescription,
        metaTitle,
        metaDescription,
        metaKeywords,
        lastModifiedBy
    }, { where: { countryOfOriginId: id } });

    sendResponse(res, 200, `Country ${StatusMessages.UPDATED}`, null);
});

const getCountryOrigins = getAllRecordsController(CountryOfOrigin, {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
});

const getCountryOriginById = getRecordByIdController(CountryOfOrigin, "countryOfOriginId", "Country", {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
});

const deleteCountryOrigin = deleteRecordController(CountryOfOrigin, "countryOfOriginId", "Country");

export {
    createCountryOrigin,
    updateCountryOrigin,
    getCountryOrigins,
    getCountryOriginById,
    deleteCountryOrigin
};