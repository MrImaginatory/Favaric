import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import Catalog from "../../../models/product/catalog.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, updateRecord, getRecord, checkRecordExists, deleteRecord } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController, searchRecordsController } from "../base.controller.js";
import { generateMetaTitle, generateMetaDescription, generateMetaKeywords } from "../../../utils/metaData.util.js"
import slugGenerator from "../../../utils/slug.util.js";
import { renameDeletedFile } from "../../../utils/file.util.js";
import logger from "../../../utils/logger.util.js";

const createCatalog = asyncHandler(async (req: Request, res: Response) => {

    const userId = (req as any).user?.userId;
    const { catalogName, catalogDescription, catalogImage, catalogSubImages, metaTitle, metaDescription, metaKeywords } = req.body;

    if (!catalogImage) {
        throw new AppError("Catalog Image is Required", 400);
    }

    const catalogSlug = slugGenerator(catalogName);
    const catalogMetaTitle = metaTitle ? metaTitle : generateMetaTitle(catalogName);
    const catalogMetaDescription = metaDescription ? metaDescription : generateMetaDescription(catalogDescription);
    const catalogMetaKeywords = metaKeywords ? metaKeywords : generateMetaKeywords(catalogName);

    const catalogExists = await checkRecordExists(Catalog, { where: { catalogName, deletedAt: null } });

    if (catalogExists) {
        throw new AppError(`Catalog ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const catalog = await createRecord(Catalog, {
        catalogName,
        catalogDescription,
        catalogImage,
        catalogSubImages,
        catalogSlug: catalogSlug,
        uploadedBy: userId,
        lastModifiedBy: userId,
        metaTitle: catalogMetaTitle,
        metaDescription: catalogMetaDescription,
        metaKeywords: catalogMetaKeywords
    });

    return sendResponse(res, 201, `Catalog ${StatusMessages.CREATED}`, catalog);

});

const updateCatalog = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { catalogName, catalogDescription, catalogImage, catalogSubImages, metaTitle, metaDescription, metaKeywords } = req.body;
    const userId = (req as any).user?.userId;

    const catalogSlug = catalogName ? slugGenerator(catalogName) : undefined;
    const catalogMetaTitle = metaTitle ? metaTitle : (catalogName ? generateMetaTitle(catalogName) : undefined);
    const catalogMetaDescription = metaDescription ? metaDescription : (catalogDescription ? generateMetaDescription(catalogDescription) : undefined);
    const catalogMetaKeywords = metaKeywords ? metaKeywords : (catalogName ? generateMetaKeywords(catalogName) : undefined);

    const currentCatalog: any = await getRecord(Catalog, {
        where: { catalogId: id, deletedAt: null }
    });

    if (!currentCatalog) {
        throw new AppError(`Catalog ${StatusMessages.NOT_FOUND}`, 404);
    }

    if (catalogName && catalogName !== currentCatalog.catalogName) {
        const nameCollision = await getRecord(Catalog, {
            where: {
                catalogName,
                deletedAt: null
            }
        });

        if (nameCollision) {
            throw new AppError(`Catalog ${StatusMessages.ALREADY_EXISTS}`, 409);
        }
    }

    // 1. Check Main Image for deletion/replacement
    if (catalogImage && currentCatalog.catalogImage && catalogImage !== currentCatalog.catalogImage) {
        await renameDeletedFile(currentCatalog.catalogImage);
    }

    // 2. Check Sub Images for deletion/replacement
    if (catalogSubImages && currentCatalog.catalogSubImages) {
        try {
            const currentSubImages: string[] = Array.isArray(currentCatalog.catalogSubImages)
                ? currentCatalog.catalogSubImages
                : (typeof currentCatalog.catalogSubImages === "string" ? JSON.parse(currentCatalog.catalogSubImages) : []);

            const newSubImages: string[] = Array.isArray(catalogSubImages)
                ? catalogSubImages
                : (typeof catalogSubImages === "string" ? JSON.parse(catalogSubImages) : []);

            const deletedSubImages = currentSubImages.filter(img => !newSubImages.includes(img));

            for (const img of deletedSubImages) {
                await renameDeletedFile(img);
            }
        } catch (error) {
            // Handle JSON parse error gracefully if needed, though multer/bodyparser should have validated this
            logger.error(`Error diffing sub-images: ${error}`);
        }
    }

    const updateData: any = {
        lastModifiedBy: userId
    };

    if (catalogName) {
        updateData.catalogName = catalogName;
        updateData.catalogSlug = catalogSlug;
        updateData.metaTitle = catalogMetaTitle;
        updateData.metaKeywords = catalogMetaKeywords;
    }
    if (catalogDescription) {
        updateData.catalogDescription = catalogDescription;
        updateData.metaDescription = catalogMetaDescription;
    }
    if (catalogImage) {
        updateData.catalogImage = catalogImage;
    }
    if (catalogSubImages) {
        updateData.catalogSubImages = catalogSubImages;
    }

    const catalog = await updateRecord(Catalog, updateData, { where: { catalogId: id } });

    return sendResponse(res, 200, `Catalog ${StatusMessages.UPDATED}`, catalog);
});

const getAllCatalogs = getAllRecordsController(Catalog, {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
});

const getCatalogById = getRecordByIdController(Catalog, "catalogId", "Catalog", {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
});

const deleteCatalog = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const catalog: any = await getRecord(Catalog, { where: { catalogId: id } as any });
    if (!catalog) {
        throw new AppError(`Catalog not found`, 404);
    }

    // Rename main image
    if (catalog.catalogImage) {
        await renameDeletedFile(catalog.catalogImage);
    }

    // Rename sub images
    if (catalog.catalogSubImages) {
        try {
            const subImages: string[] = Array.isArray(catalog.catalogSubImages)
                ? catalog.catalogSubImages
                : (typeof catalog.catalogSubImages === "string" ? JSON.parse(catalog.catalogSubImages) : []);

            for (const img of subImages) {
                await renameDeletedFile(img);
            }
        } catch (error) {
            console.error("Error parsing sub-images for deletion:", error);
        }
    }

    await deleteRecord(Catalog, "catalogId", id);

    sendResponse(res, 200, StatusMessages.SUCCESS, null);
});

const searchCatalog = searchRecordsController(Catalog, ["catalogName"], {
    include: [
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
}, "catalog");

export {
    createCatalog,
    updateCatalog,
    getAllCatalogs,
    getCatalogById,
    deleteCatalog,
    searchCatalog
};
