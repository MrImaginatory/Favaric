import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import AppError from "../../../utils/appError.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import Product from "../../../models/product/product.model.js";
import User from "../../../models/users/user.model.js";
import { createRecord, updateRecord, getRecord, checkRecordExists, deleteRecord } from "../../../services/base.service.js";
import { getRecordByIdController, getAllRecordsController } from "../base.controller.js";
import { generateMetaTitle, generateMetaDescription, generateMetaKeywords } from "../../../utils/metaData.util.js"
import slugGenerator from "../../../utils/slug.util.js";
import { renameDeletedFile } from "../../../utils/file.util.js";
import logger from "../../../utils/logger.util.js";
import { Op } from "@sequelize/core";

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

    const uploadedBy = req.session?.userId;
    const lastModifiedBy = req.session?.userId;

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

    const referenceChecks: Array<{ model: any; condition: any; name: string }> = [
        { model: Category, condition: { categoryId: category }, name: "Category" },
        { model: Brand, condition: { brandId: brand }, name: "Brand" },
        { model: Fabric, condition: { fabricId: fabric }, name: "Fabric" },
        { model: Occasion, condition: { occasionId: occasion }, name: "Occasion" },
        { model: Pattern, condition: { patternId: pattern }, name: "Pattern" },
        { model: Length, condition: { lengthId: length }, name: "Length" },
        { model: CountryOfOrigin, condition: { countryOfOriginId: countryOfOrigin }, name: "Country of Origin" },
        { model: Color, condition: { colorId: color }, name: "Color" },
        { model: Size, condition: { sizeId: size }, name: "Size" },
        { model: Weight, condition: { weightId: weight }, name: "Weight" },
        { model: Dimensions, condition: { dimensionsId: dimensions }, name: "Dimensions" },
        { model: ProductType, condition: { productTypeId: productType }, name: "Product Type" },
        { model: ShippingCharge, condition: { shippingChargeId: shippingCharge }, name: "Shipping Charge" }
    ];

    if (isCatalog) {
        referenceChecks.push({ model: Catalog, condition: { catalogId: catalogId }, name: "Catalog" });
    }

    const checkResults = await Promise.all(
        referenceChecks.map(async (check) => {
            const exists = await checkRecordExists(check.model, check.condition);
            return exists ? null : check.name;
        })
    );

    const failedCheck = checkResults.find(result => result !== null);
    if (failedCheck) {
        throw new AppError(`${failedCheck} ${StatusMessages.NOT_FOUND}`, 404);
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

    const lastModifiedBy = req.session?.userId;

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

    const referenceChecks: Array<{ model: any; condition: any; name: string }> = [];

    if (category) referenceChecks.push({ model: Category, condition: { categoryId: category }, name: "Category" });
    if (brand) referenceChecks.push({ model: Brand, condition: { brandId: brand }, name: "Brand" });
    if (fabric) referenceChecks.push({ model: Fabric, condition: { fabricId: fabric }, name: "Fabric" });
    if (occasion) referenceChecks.push({ model: Occasion, condition: { occasionId: occasion }, name: "Occasion" });
    if (pattern) referenceChecks.push({ model: Pattern, condition: { patternId: pattern }, name: "Pattern" });
    if (length) referenceChecks.push({ model: Length, condition: { lengthId: length }, name: "Length" });
    if (countryOfOrigin) referenceChecks.push({ model: CountryOfOrigin, condition: { countryOfOriginId: countryOfOrigin }, name: "Country of Origin" });
    if (color) referenceChecks.push({ model: Color, condition: { colorId: color }, name: "Color" });
    if (size) referenceChecks.push({ model: Size, condition: { sizeId: size }, name: "Size" });
    if (weight) referenceChecks.push({ model: Weight, condition: { weightId: weight }, name: "Weight" });
    if (dimensions) referenceChecks.push({ model: Dimensions, condition: { dimensionsId: dimensions }, name: "Dimensions" });
    if (productType) referenceChecks.push({ model: ProductType, condition: { productTypeId: productType }, name: "Product Type" });
    if (shippingCharge) referenceChecks.push({ model: ShippingCharge, condition: { shippingChargeId: shippingCharge }, name: "Shipping Charge" });
    if (isCatalog !== undefined && isCatalog) {
        if (catalogId) {
            referenceChecks.push({ model: Catalog, condition: { catalogId: catalogId }, name: "Catalog" });
        }
    }

    if (referenceChecks.length > 0) {
        const checkResults = await Promise.all(
            referenceChecks.map(async (check) => {
                const exists = await checkRecordExists(check.model, check.condition);
                return exists ? null : check.name;
            })
        );

        const failedCheck = checkResults.find(result => result !== null);
        if (failedCheck) {
            throw new AppError(`${failedCheck} ${StatusMessages.NOT_FOUND}`, 404);
        }
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

    return sendResponse(res, 200, `Product ${StatusMessages.UPDATED}`, product);
});

const getProductById = getRecordByIdController(Product, "productId", "Product", {
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
})

const getAllProducts = getAllRecordsController(Product, {
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
})

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

    sendResponse(res, 200, StatusMessages.SUCCESS, null);
});

export default {
    addProduct,
    updateProduct,
    getProductById,
    getAllProducts,
    deleteProduct,
}