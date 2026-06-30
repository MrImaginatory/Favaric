import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import Category from "../../../models/product/category.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, checkRecordExists, getRecord, updateRecord, deleteRecord, getAllRecords } from "../../../services/base.service.js";
import { searchRecordsController } from "../base.controller.js";
import { generateMetaTitle, generateMetaDescription, generateMetaKeywords } from "../../../utils/metaData.util.js"
import slugGenerator from "../../../utils/slug.util.js";
import { renameDeletedFile } from "../../../utils/file.util.js";
import { getCache, setCache, deleteCacheByPattern } from "../../../services/cache.service.js";
import { refreshRefData } from "../../../services/refCache.service.js";
import { Op } from "@sequelize/core";

const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const {
        categoryName,
        categoryDescription,
        categoryImage,
        isFeatured,
        isPopular,
        metaTitle,
        metaDescription,
        metaKeywords
    } = req.body;

    if (!categoryImage) {
        throw new AppError("Category Image is Required", 400);
    }

    const categorySlug = slugGenerator(categoryName);
    const categoryMetaTitle = metaTitle ? metaTitle : generateMetaTitle(categoryName);
    const categoryMetaDescription = metaDescription ? metaDescription : generateMetaDescription(categoryDescription || categoryName);
    const categoryMetaKeywords = metaKeywords ? metaKeywords : generateMetaKeywords(categoryName);

    const categoryExists = await checkRecordExists(Category, { where: { categoryName, deletedAt: null } });

    if (categoryExists) {
        throw new AppError(`Category ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const category = await createRecord(Category, {
        categoryName,
        categoryDescription,
        categoryImage,
        isFeatured: Boolean(isFeatured),
        isPopular: Boolean(isPopular),
        categorySlug,
        uploadedBy: userId,
        lastModifiedBy: userId,
        metaTitle: categoryMetaTitle,
        metaDescription: categoryMetaDescription,
        metaKeywords: categoryMetaKeywords
    });

    await deleteCacheByPattern("categories:*");
    await refreshRefData("ref:categories");

    return sendResponse(res, 201, `Category ${StatusMessages.CREATED}`, category);
});

const categoryIncludes = [
    { model: User, as: "uploader", attributes: ["userName"] },
    { model: User, as: "modifier", attributes: ["userName"] }
];

const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 1000;
    const cursor = req.query.cursor as string | undefined;
    const cacheKey = `categories:list:${limit}:${cursor || "first"}`;

    const cached = await getCache<any>(cacheKey);
    if (cached) {
        sendResponse(res, 200, StatusMessages.SUCCESS, cached);
        return;
    }

    const options: any = { include: categoryIncludes };
    if (!isNaN(limit) && limit > 0) {
        options.limit = limit;
    }
    if (cursor) {
        options.where = { ...options.where, createdAt: { [Op.lt]: cursor } };
    }
    if (!options.order) {
        options.order = [["createdAt", "DESC"]];
    }

    const records = await getAllRecords(Category, options);

    let nextCursor = null;
    if (records.length > 0 && records.length === limit) {
        nextCursor = (records[records.length - 1] as any).createdAt;
    }

    const result = { records, nextCursor };
    await setCache(cacheKey, result, 60);

    sendResponse(res, 200, StatusMessages.SUCCESS, result);
});

const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const cacheKey = `categories:${id}`;

    const cached = await getCache<any>(cacheKey);
    if (cached) {
        sendResponse(res, 200, StatusMessages.SUCCESS, cached);
        return;
    }

    const record = await getRecord(Category, {
        where: { categoryId: id },
        include: categoryIncludes
    });

    if (!record) {
        throw new AppError("Category not found", 404);
    }

    await setCache(cacheKey, record, 300);
    sendResponse(res, 200, StatusMessages.SUCCESS, record);
});

const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const {
        categoryName,
        categoryDescription,
        categoryImage,
        isFeatured,
        isPopular,
        metaTitle,
        metaDescription,
        metaKeywords
    } = req.body;
    const userId = (req as any).user?.userId;

    const categorySlug = categoryName ? slugGenerator(categoryName) : undefined;
    const categoryMetaTitle = metaTitle ? metaTitle : (categoryName ? generateMetaTitle(categoryName) : undefined);
    const categoryMetaDescription = metaDescription ? metaDescription : (categoryDescription ? generateMetaDescription(categoryDescription) : (categoryName ? generateMetaDescription(categoryName) : undefined));
    const categoryMetaKeywords = metaKeywords ? metaKeywords : (categoryName ? generateMetaKeywords(categoryName) : undefined);

    const currentCategory: any = await getRecord(Category, {
        where: { categoryId: id, deletedAt: null }
    });

    if (!currentCategory) {
        throw new AppError(`Category ${StatusMessages.NOT_FOUND}`, 404);
    }

    if (categoryName && categoryName !== currentCategory.categoryName) {
        const nameCollision = await getRecord(Category, {
            where: {
                categoryName,
                deletedAt: null
            }
        });

        if (nameCollision) {
            throw new AppError(`Category ${StatusMessages.ALREADY_EXISTS}`, 409);
        }
    }

    const updateData: any = {
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        isPopular: isPopular !== undefined ? Boolean(isPopular) : undefined,
        lastModifiedBy: userId
    };

    if (categoryName) {
        updateData.categoryName = categoryName;
        updateData.categorySlug = categorySlug;
        updateData.metaTitle = categoryMetaTitle;
        updateData.metaKeywords = categoryMetaKeywords;
    }
    if (categoryDescription) {
        updateData.categoryDescription = categoryDescription;
        updateData.metaDescription = categoryMetaDescription;
    }

    if (req.body.remove_categoryImage === 'true') {
        updateData.categoryImage = null;
        if (currentCategory.categoryImage) {
            await renameDeletedFile(currentCategory.categoryImage);
        }
    } else if (categoryImage) {
        updateData.categoryImage = categoryImage;
        if (currentCategory.categoryImage && categoryImage !== currentCategory.categoryImage) {
            await renameDeletedFile(currentCategory.categoryImage);
        }
    }

    const category = await updateRecord(Category, updateData, { where: { categoryId: id } });

    await deleteCacheByPattern("categories:*");
    await refreshRefData("ref:categories");

    return sendResponse(res, 200, `Category ${StatusMessages.UPDATED}`, category);
});

const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const category: any = await getRecord(Category, { where: { categoryId: id } as any });
    if (!category) {
        throw new AppError(`Category not found`, 404);
    }

    if (category.categoryImage) {
        await renameDeletedFile(category.categoryImage);
    }

    await deleteRecord(Category, "categoryId", id);

    await deleteCacheByPattern("categories:*");
    await refreshRefData("ref:categories");

    sendResponse(res, 200, StatusMessages.SUCCESS, null);
});

const searchCategories = searchRecordsController(Category, ["categoryName"], {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
}, "category");

export {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    searchCategories
};
