import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import Category from "../../../models/product/category.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, checkRecordExists, getRecord, updateRecord, deleteRecord } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController } from "../base.controller.js";
import { generateMetaTitle, generateMetaDescription, generateMetaKeywords } from "../../../utils/metaData.util.js"
import slugGenerator from "../../../utils/slug.util.js";
import { renameDeletedFile } from "../../../utils/file.util.js";

const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.session.userId;
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

    const categorySlug = slugGenerator(categoryName);
    const categoryMetaTitle = metaTitle ? metaTitle : generateMetaTitle(categoryName);
    const categoryMetaDescription = metaDescription ? metaDescription : generateMetaDescription(categoryDescription || categoryName);
    const categoryMetaKeywords = metaKeywords ? metaKeywords : generateMetaKeywords(categoryName);

    const categoryExists = await checkRecordExists(Category, { categoryName, deletedAt: null });

    if (categoryExists) {
        throw new AppError(`Category ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const category = await createRecord(Category, {
        categoryName,
        categoryDescription,
        categoryImage,
        isFeatured: isFeatured ?? false,
        isPopular: isPopular ?? false,
        categorySlug,
        uploadedBy: userId,
        lastModifiedBy: userId,
        metaTitle: categoryMetaTitle,
        metaDescription: categoryMetaDescription,
        metaKeywords: categoryMetaKeywords
    });

    return sendResponse(res, 201, `Category ${StatusMessages.CREATED}`, category);
});

const getAllCategories = getAllRecordsController(Category, {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
});

const getCategoryById = getRecordByIdController(Category, "categoryId", "Category", {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
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
    const userId = req.session.userId;

    const categorySlug = slugGenerator(categoryName);
    const categoryMetaTitle = metaTitle ? metaTitle : generateMetaTitle(categoryName);
    const categoryMetaDescription = metaDescription ? metaDescription : generateMetaDescription(categoryDescription || categoryName);
    const categoryMetaKeywords = metaKeywords ? metaKeywords : generateMetaKeywords(categoryName);

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

    // Handle Image Deletion
    if (categoryImage && currentCategory.categoryImage && categoryImage !== currentCategory.categoryImage) {
        await renameDeletedFile(currentCategory.categoryImage);
    }

    const category = await updateRecord(Category, {
        categoryName,
        categoryDescription,
        categoryImage,
        isFeatured,
        isPopular,
        categorySlug,
        lastModifiedBy: userId,
        metaTitle: categoryMetaTitle,
        metaDescription: categoryMetaDescription,
        metaKeywords: categoryMetaKeywords
    }, { where: { categoryId: id } });

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

    sendResponse(res, 200, StatusMessages.SUCCESS, null);
});

export {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
