import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import Product from "../../../models/product/product.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, updateRecord, getRecord, checkRecordExists, deleteRecord, getAllRecords } from "../../../services/base.service.js";
import { searchRecordsController } from "../base.controller.js";
import { generateMetaTitle, generateMetaDescription, generateMetaKeywords } from "../../../utils/metaData.util.js"
import slugGenerator from "../../../utils/slug.util.js";
import { renameDeletedFile } from "../../../utils/file.util.js";
import logger from "../../../utils/logger.util.js";
import { Op } from "@sequelize/core";
import { getCache, setCache, deleteCacheByPattern } from "../../../services/cache.service.js";
import { validateAllReferences, buildReferenceChecks } from "../../../services/refCache.service.js";

import Category from "../../../models/product/category.model.js";
import Brand from "../../../models/product/brand.model.js";
import Fabric from "../../../models/product/fabric.model.js";
import ShippingCharge from "../../../models/product/shippingCharge.model.js";
import Pattern from "../../../models/product/pattern.model.js";
import Length from "../../../models/product/length.model.js";
import Occasion from "../../../models/product/occasion.model.js";
import CountryOfOrigin from "../../../models/product/countryOfOrigin.model.js";
import Color from "../../../models/product/color.model.js";
import Size from "../../../models/product/size.model.js";
import Weight from "../../../models/product/weight.model.js";
import Dimensions from "../../../models/product/dimension.model.js";
import ProductType from "../../../models/product/productType.model.js";
import Catalog from "../../../models/product/catalog.model.js";

const addProduct = asyncHandler(async (req: Request, res: Response) => {
    const {
        productName,
        productTitle,
        productDescription,
        regularPrice,
        salePrice,
        currency,
        gstPercentage,
        category,
        brand,
        thumbnailImage,
        image,
        subImages,
        stock,
        maxOrderQty,
        minOrderQty,
        designCode,
        sku,
        hsn,
        fabric,
        occasion,
        pattern,
        length,
        transparency,
        countryOfOrigin,
        color,
        size,
        weight,
        dimensions,
        isFeatured,
        isTrending,
        isNewArrival,
        isDiscounted,
        isAvailable,
        isCatalog,
        catalogId,
        isPinned,
        pinPosition,
        productType,
        quantityPerUnit,
        shippingCharge,
        productStitched,
        moq,
        otherDetails,
        metaTitle,
        metaDescription,
        metaKeywords,
        productSlug
    } = req.body;

    const uploadedBy = (req as any).user?.userId;
    const lastModifiedBy = (req as any).user?.userId;

    const productMetaTitle = metaTitle ? metaTitle : generateMetaTitle(productTitle);
    const productMetaDescription = metaDescription ? metaDescription : generateMetaDescription(productDescription);
    const productMetaKeywords = metaKeywords ? metaKeywords : generateMetaKeywords(productName);
    const generateProductSlug = productSlug ? productSlug : slugGenerator(productTitle);

    const existingProduct = await checkRecordExists(Product, {
        productName: { [Op.iLike]: productName }
    });

    if (existingProduct) {
        throw new AppError(`Product ${StatusMessages.ALREADY_EXISTS}`, 409);
    }

    const failedRef = await validateAllReferences(buildReferenceChecks([
        { value: category, model: Category, keyField: "categoryId", name: "Category" },
        { value: brand, model: Brand, keyField: "brandId", name: "Brand" },
        { value: fabric, model: Fabric, keyField: "fabricId", name: "Fabric" },
        { value: occasion, model: Occasion, keyField: "occasionId", name: "Occasion" },
        { value: pattern, model: Pattern, keyField: "patternId", name: "Pattern" },
        { value: length, model: Length, keyField: "lengthId", name: "Length" },
        { value: countryOfOrigin, model: CountryOfOrigin, keyField: "countryOfOriginId", name: "Country of Origin" },
        { value: color, model: Color, keyField: "colorId", name: "Color" },
        { value: size, model: Size, keyField: "sizeId", name: "Size" },
        { value: weight, model: Weight, keyField: "weightId", name: "Weight" },
        { value: dimensions, model: Dimensions, keyField: "dimensionId", name: "Dimensions" },
        { value: productType, model: ProductType, keyField: "productTypeId", name: "Product Type" },
        { value: shippingCharge, model: ShippingCharge, keyField: "shippingChargeId", name: "Shipping Charge" },
        ...(isCatalog ? [{ value: catalogId, model: Catalog, keyField: "catalogId", name: "Catalog" }] : []),
    ]));

    if (failedRef) {
        throw new AppError(`${failedRef} ${StatusMessages.NOT_FOUND}`, 404);
    }

    const product = await createRecord(Product, {
        productName,
        productTitle,
        productDescription,
        productSlug: generateProductSlug,
        regularPrice,
        salePrice,
        currency,
        gstPercentage,
        category,
        brand,
        thumbnailImage,
        image,
        subImages,
        stock,
        maxOrderQty,
        minOrderQty,
        designCode,
        sku,
        hsn,
        fabric,
        occasion,
        pattern,
        length,
        transparency,
        countryOfOrigin,
        color,
        size,
        weight,
        dimensions,
        isFeatured,
        isTrending,
        isNewArrival,
        isDiscounted,
        isAvailable,
        isCatalog,
        catalogId,
        isPinned,
        pinPosition,
        productType,
        quantityPerUnit,
        shippingCharge,
        productStitched,
        moq,
        otherDetails,
        metaTitle: productMetaTitle,
        metaDescription: productMetaDescription,
        metaKeywords: productMetaKeywords,
        uploadedBy,
        lastModifiedBy,
    })

    await deleteCacheByPattern("products:*");

    return sendResponse(res, 201, `Product ${StatusMessages.CREATED}`, product);

})

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const {
        productName,
        productTitle,
        productDescription,
        regularPrice,
        salePrice,
        currency,
        gstPercentage,
        category,
        brand,
        thumbnailImage,
        image,
        subImages,
        stock,
        maxOrderQty,
        minOrderQty,
        designCode,
        sku,
        hsn,
        fabric,
        occasion,
        pattern,
        length,
        transparency,
        countryOfOrigin,
        color,
        size,
        weight,
        dimensions,
        isFeatured,
        isTrending,
        isNewArrival,
        isDiscounted,
        isAvailable,
        isCatalog,
        catalogId,
        isPinned,
        pinPosition,
        productType,
        quantityPerUnit,
        shippingCharge,
        productStitched,
        moq,
        otherDetails,
        metaTitle,
        metaDescription,
        metaKeywords,
        productSlug
    } = req.body;

    const lastModifiedBy = (req as any).user?.userId;

    const currentProduct: any = await getRecord(Product, {
        where: { productId: id, deletedAt: null }
    });

    if (!currentProduct) {
        throw new AppError(`Product ${StatusMessages.NOT_FOUND}`, 404);
    }

    if (productName && productName !== currentProduct.productName) {
        const nameCollision = await getRecord(Product, {
            where: {
                productName: { [Op.iLike]: productName },
                deletedAt: null
            }
        });

        if (nameCollision) {
            throw new AppError(`Product ${StatusMessages.ALREADY_EXISTS}`, 409);
        }
    }

    const failedRef = await validateAllReferences([
        ...(category ? [{ value: category, model: Category, keyField: "categoryId", name: "Category" }] : []),
        ...(brand ? [{ value: brand, model: Brand, keyField: "brandId", name: "Brand" }] : []),
        ...(fabric ? [{ value: fabric, model: Fabric, keyField: "fabricId", name: "Fabric" }] : []),
        ...(occasion ? [{ value: occasion, model: Occasion, keyField: "occasionId", name: "Occasion" }] : []),
        ...(pattern ? [{ value: pattern, model: Pattern, keyField: "patternId", name: "Pattern" }] : []),
        ...(length ? [{ value: length, model: Length, keyField: "lengthId", name: "Length" }] : []),
        ...(countryOfOrigin ? [{ value: countryOfOrigin, model: CountryOfOrigin, keyField: "countryOfOriginId", name: "Country of Origin" }] : []),
        ...(color ? [{ value: color, model: Color, keyField: "colorId", name: "Color" }] : []),
        ...(size ? [{ value: size, model: Size, keyField: "sizeId", name: "Size" }] : []),
        ...(weight ? [{ value: weight, model: Weight, keyField: "weightId", name: "Weight" }] : []),
        ...(dimensions ? [{ value: dimensions, model: Dimensions, keyField: "dimensionId", name: "Dimensions" }] : []),
        ...(productType ? [{ value: productType, model: ProductType, keyField: "productTypeId", name: "Product Type" }] : []),
        ...(shippingCharge ? [{ value: shippingCharge, model: ShippingCharge, keyField: "shippingChargeId", name: "Shipping Charge" }] : []),
        ...(isCatalog && catalogId ? [{ value: catalogId, model: Catalog, keyField: "catalogId", name: "Catalog" }] : []),
    ]);

    if (failedRef) {
        throw new AppError(`${failedRef} ${StatusMessages.NOT_FOUND}`, 404);
    }

    // 1. Check Thumbnail Image for deletion/replacement
    if (thumbnailImage && currentProduct.thumbnailImage && thumbnailImage !== currentProduct.thumbnailImage) {
        await renameDeletedFile(currentProduct.thumbnailImage);
    }

    // 2. Check Main Image for deletion/replacement
    if (image && currentProduct.image && image !== currentProduct.image) {
        await renameDeletedFile(currentProduct.image);
    }

    // 3. Check Sub Images for deletion/replacement
    if (subImages && currentProduct.subImages) {
        try {
            const currentSubImages: string[] = Array.isArray(currentProduct.subImages)
                ? currentProduct.subImages
                : (typeof currentProduct.subImages === "string" ? JSON.parse(currentProduct.subImages) : []);

            const newSubImages: string[] = Array.isArray(subImages)
                ? subImages
                : (typeof subImages === "string" ? JSON.parse(subImages) : []);

            const deletedSubImages = currentSubImages.filter(img => !newSubImages.includes(img));

            for (const img of deletedSubImages) {
                await renameDeletedFile(img);
            }
        } catch (error) {
            logger.error(`Error diffing sub-images: ${error}`);
        }
    }

    const productMetaTitle = metaTitle ? metaTitle : (productTitle ? generateMetaTitle(productTitle) : undefined);
    const productMetaDescription = metaDescription ? metaDescription : (productDescription ? generateMetaDescription(productDescription) : undefined);
    const productMetaKeywords = metaKeywords ? metaKeywords : (productName ? generateMetaKeywords(productName) : undefined);
    const generateProductSlug = productSlug ? productSlug : (productTitle ? slugGenerator(productTitle) : undefined);

    const updateData: any = {
        productName,
        productTitle,
        productDescription,
        productSlug: generateProductSlug,
        regularPrice,
        salePrice,
        currency,
        gstPercentage,
        category,
        brand,
        thumbnailImage,
        image,
        subImages,
        stock,
        maxOrderQty,
        minOrderQty,
        designCode,
        sku,
        hsn,
        fabric,
        occasion,
        pattern,
        length,
        transparency,
        countryOfOrigin,
        color,
        size,
        weight,
        dimensions,
        isFeatured,
        isTrending,
        isNewArrival,
        isDiscounted,
        isAvailable,
        isCatalog,
        catalogId,
        isPinned,
        pinPosition,
        productType,
        quantityPerUnit,
        shippingCharge,
        productStitched,
        moq,
        otherDetails,
        metaTitle: productMetaTitle,
        metaDescription: productMetaDescription,
        metaKeywords: productMetaKeywords,
        lastModifiedBy,
    };

    Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
            delete updateData[key];
        }
    });

    const product = await updateRecord(Product, updateData, { where: { productId: id } });

    await deleteCacheByPattern("products:*");

    return sendResponse(res, 200, `Product ${StatusMessages.UPDATED}`, product);
});

const productIncludes = [
    { model: Category, as: "categoryDetails" },
    { model: Brand, as: "brandDetails" },
    { model: Fabric, as: "fabricDetails" },
    { model: Occasion, as: "occasionDetails" },
    { model: Pattern, as: "patternDetails" },
    { model: Length, as: "lengthDetails" },
    { model: CountryOfOrigin, as: "countryOfOriginDetails" },
    { model: Color, as: "colorDetails" },
    { model: Size, as: "sizeDetails" },
    { model: Weight, as: "weightDetails" },
    { model: Dimensions, as: "dimensionDetails" },
    { model: ProductType, as: "productTypeDetails" },
    { model: Catalog, as: "catalogDetails" },
    { model: ShippingCharge, as: "shippingChargeDetails" },
    { model: User, as: "uploader", attributes: ["userName"] },
    { model: User, as: "modifier", attributes: ["userName"] }
];

const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const cacheKey = `products:${id}`;

    const cached = await getCache<any>(cacheKey);
    if (cached) {
        sendResponse(res, 200, StatusMessages.SUCCESS, cached);
        return;
    }

    const record = await getRecord(Product, {
        where: { productId: id },
        include: productIncludes
    });

    if (!record) {
        throw new AppError("Product not found", 404);
    }

    await setCache(cacheKey, record, 300);
    sendResponse(res, 200, StatusMessages.SUCCESS, record);
});

const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 1000;
    const cursor = req.query.cursor as string | undefined;
    const cacheKey = `products:list:${limit}:${cursor || "first"}`;

    const cached = await getCache<any>(cacheKey);
    if (cached) {
        sendResponse(res, 200, StatusMessages.SUCCESS, cached);
        return;
    }

    const options: any = { include: productIncludes };
    if (!isNaN(limit) && limit > 0) {
        options.limit = limit;
    }
    if (cursor) {
        options.where = { ...options.where, createdAt: { [Op.lt]: cursor } };
    }
    if (!options.order) {
        options.order = [["createdAt", "DESC"]];
    }

    const records = await getAllRecords(Product, options);

    let nextCursor = null;
    if (records.length > 0 && records.length === limit) {
        nextCursor = (records[records.length - 1] as any).createdAt;
    }

    const result = { records, nextCursor };
    await setCache(cacheKey, result, 60);

    sendResponse(res, 200, StatusMessages.SUCCESS, result);
});

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const product: any = await getRecord(Product, { where: { productId: id } as any });
    if (!product) {
        throw new AppError(`Product not found`, 404);
    }

    if (product.thumbnailImage) {
        await renameDeletedFile(product.thumbnailImage);
    }

    if (product.image) {
        await renameDeletedFile(product.image);
    }

    if (product.subImages) {
        try {
            const subImages: string[] = Array.isArray(product.subImages)
                ? product.subImages
                : (typeof product.subImages === "string" ? JSON.parse(product.subImages) : []);

            for (const img of subImages) {
                await renameDeletedFile(img);
            }
        } catch (error) {
            logger.error(`Error parsing sub-images for deletion: ${error}`);
        }
    }

    await deleteRecord(Product, "productId", id);

    await deleteCacheByPattern("products:*");

    sendResponse(res, 200, StatusMessages.SUCCESS, null);
});

const searchProduct = searchRecordsController(Product, ["productName", "productTitle", "productDescription", "designCode", "sku", "hsn"], {
    include: [
        { model: Category, as: "categoryDetails" },
        { model: Brand, as: "brandDetails" },
        { model: Fabric, as: "fabricDetails" },
        { model: Occasion, as: "occasionDetails" },
        { model: Pattern, as: "patternDetails" },
        { model: Length, as: "lengthDetails" },
        { model: CountryOfOrigin, as: "countryOfOriginDetails" },
        { model: Color, as: "colorDetails" },
        { model: Size, as: "sizeDetails" },
        { model: Weight, as: "weightDetails" },
        { model: Dimensions, as: "dimensionDetails" },
        { model: ProductType, as: "productTypeDetails" },
        { model: Catalog, as: "catalogDetails" },
        { model: ShippingCharge, as: "shippingChargeDetails" },
        { model: User, as: "uploader", attributes: ["userName"] },
        { model: User, as: "modifier", attributes: ["userName"] }
    ]
}, "product");

export default {
    addProduct,
    updateProduct,
    getProductById,
    getAllProducts,
    deleteProduct,
    searchProduct
}