import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import SubCategory from "../../../models/product/subcategory.model.js";
import Category from "../../../models/product/category.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, checkRecordExists, getRecord, updateRecord, deleteRecord } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController } from "../base.controller.js";
import { generateMetaTitle, generateMetaDescription, generateMetaKeywords } from "../../../utils/metaData.util.js"
import slugGenerator from "../../../utils/slug.util.js";
import { renameDeletedFile } from "../../../utils/file.util.js";

const createSubCategory = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.session.userId;
    const {
        subcategoryName,
        subcategoryDescription,
        subcategoryImage,
        categoryId,
        isFeatured,
        isPopular,
        metaTitle,
        metaDescription,
        metaKeywords
    } = req.body;

    const subcategorySlug = slugGenerator(subcategoryName);
    const subcategoryMetaTitle = metaTitle ? metaTitle : generateMetaTitle(subcategoryName);
    const subcategoryMetaDescription = metaDescription ? metaDescription : generateMetaDescription(subcategoryDescription || subcategoryName);
    const subcategoryMetaKeywords = metaKeywords ? metaKeywords : generateMetaKeywords(subcategoryName);

    const categoryExists = await checkRecordExists(Category, { where: { categoryId, deletedAt: null } });
    if (!categoryExists) {
        throw new AppError(`Category ${StatusMessages.NOT_FOUND}`, 404);
    }

    const subcategoryExists = await checkRecordExists(SubCategory, { where: { subcategoryName, deletedAt: null } });

    if (subcategoryExists) {
        throw new AppError(`SubCategory ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const subcategory = await createRecord(SubCategory, {
        subcategoryName,
        subcategoryDescription,
        subcategoryImage,
        categoryId,
        isFeatured: Boolean(isFeatured),
        isPopular: Boolean(isPopular),
        subcategorySlug,
        uploadedBy: userId,
        lastModifiedBy: userId,
        metaTitle: subcategoryMetaTitle,
        metaDescription: subcategoryMetaDescription,
        metaKeywords: subcategoryMetaKeywords
    });

    return sendResponse(res, 201, `SubCategory ${StatusMessages.CREATED}`, subcategory);
});

const getAllSubCategories = getAllRecordsController(SubCategory, {
    include: [
        { model: Category, as: "category", attributes: ["categoryName"] },
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
});

const getSubCategoryById = getRecordByIdController(SubCategory, "subCategoryId", "SubCategory", {
    include: [
        { model: Category, as: "category", attributes: ["categoryName"] },
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
});

const updateSubCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const {
        subcategoryName,
        subcategoryDescription,
        subcategoryImage,
        categoryId,
        isFeatured,
        isPopular,
        metaTitle,
        metaDescription,
        metaKeywords
    } = req.body;
    const userId = req.session.userId;

    const subcategorySlug = slugGenerator(subcategoryName);
    const subcategoryMetaTitle = metaTitle ? metaTitle : generateMetaTitle(subcategoryName);
    const subcategoryMetaDescription = metaDescription ? metaDescription : generateMetaDescription(subcategoryDescription || subcategoryName);
    const subcategoryMetaKeywords = metaKeywords ? metaKeywords : generateMetaKeywords(subcategoryName);

    const currentSubCategory: any = await getRecord(SubCategory, {
        where: { subCategoryId: id, deletedAt: null }
    });

    if (!currentSubCategory) {
        throw new AppError(`SubCategory ${StatusMessages.NOT_FOUND}`, 404);
    }

    if (categoryId && categoryId !== currentSubCategory.categoryId) {
        const categoryExists = await checkRecordExists(Category, { where: { categoryId, deletedAt: null } });
        if (!categoryExists) {
            throw new AppError(`Category ${StatusMessages.NOT_FOUND}`, 404);
        }
    }

    if (subcategoryName && subcategoryName !== currentSubCategory.subcategoryName) {
        const nameCollision = await getRecord(SubCategory, {
            where: {
                subcategoryName,
                deletedAt: null
            }
        });

        if (nameCollision) {
            throw new AppError(`SubCategory ${StatusMessages.ALREADY_EXISTS}`, 409);
        }
    }

    // Handle Image Deletion
    if (subcategoryImage && currentSubCategory.subcategoryImage && subcategoryImage !== currentSubCategory.subcategoryImage) {
        await renameDeletedFile(currentSubCategory.subcategoryImage);
    }

    const subcategory = await updateRecord(SubCategory, {
        subcategoryName,
        subcategoryDescription,
        subcategoryImage,
        categoryId,
        isFeatured: Boolean(isFeatured),
        isPopular: Boolean(isPopular),
        subcategorySlug,
        lastModifiedBy: userId,
        metaTitle: subcategoryMetaTitle,
        metaDescription: subcategoryMetaDescription,
        metaKeywords: subcategoryMetaKeywords
    }, { where: { subCategoryId: id } });

    return sendResponse(res, 200, `SubCategory ${StatusMessages.UPDATED}`, subcategory);
});

const deleteSubCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const subcategory: any = await getRecord(SubCategory, { where: { subCategoryId: id } as any });
    if (!subcategory) {
        throw new AppError(`SubCategory not found`, 404);
    }

    if (subcategory.subcategoryImage) {
        await renameDeletedFile(subcategory.subcategoryImage);
    }

    await deleteRecord(SubCategory, "subCategoryId", id);

    sendResponse(res, 200, StatusMessages.SUCCESS, null);
});

export {
    createSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory
};
