import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import { getAllRecords } from "../../../services/base.service.js";
import { getCache, setCache } from "../../../services/cache.service.js";

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

const getAllReferenceData = asyncHandler(async (_req: Request, res: Response) => {
    const cacheKey = "products:referenceData:all";

    const cached = await getCache<any>(cacheKey);
    if (cached) {
        sendResponse(res, 200, StatusMessages.SUCCESS, cached);
        return;
    }

    const [
        categories,
        brands,
        fabrics,
        occasions,
        patterns,
        lengths,
        countries,
        colors,
        sizes,
        weights,
        dimensions,
        productTypes,
        catalogs,
        shippingCharges
    ] = await Promise.all([
        getAllRecords(Category, { attributes: ["categoryId", "categoryName"], order: [["categoryName", "ASC"]] }),
        getAllRecords(Brand, { attributes: ["brandId", "brandName"], order: [["brandName", "ASC"]] }),
        getAllRecords(Fabric, { attributes: ["fabricId", "fabricName"], order: [["fabricName", "ASC"]] }),
        getAllRecords(Occasion, { attributes: ["occasionId", "occasionName"], order: [["occasionName", "ASC"]] }),
        getAllRecords(Pattern, { attributes: ["patternId", "patternName"], order: [["patternName", "ASC"]] }),
        getAllRecords(Length, { attributes: ["lengthId", "lengthName", "lengthValue"], order: [["lengthName", "ASC"]] }),
        getAllRecords(CountryOfOrigin, { attributes: ["countryOfOriginId", "countryOfOriginName"], order: [["countryOfOriginName", "ASC"]] }),
        getAllRecords(Color, { attributes: ["colorId", "colorName", "colorCode"], order: [["colorName", "ASC"]] }),
        getAllRecords(Size, { attributes: ["sizeId", "sizeName", "sizeValue"], order: [["sizeName", "ASC"]] }),
        getAllRecords(Weight, { attributes: ["weightId", "weightName", "weightValue"], order: [["weightName", "ASC"]] }),
        getAllRecords(Dimensions, { attributes: ["dimensionId", "dimensionName", "dimensionLength", "dimensionBreadth", "dimensionHeight"], order: [["dimensionName", "ASC"]] }),
        getAllRecords(ProductType, { attributes: ["productTypeId", "productTypeName"], order: [["productTypeName", "ASC"]] }),
        getAllRecords(Catalog, { attributes: ["catalogId", "catalogName"], order: [["catalogName", "ASC"]] }),
        getAllRecords(ShippingCharge, { attributes: ["shippingChargeId", "shippingBaseCountry", "shippingPrice"], order: [["shippingBaseCountry", "ASC"]] })
    ]);

    const result = {
        categories,
        brands,
        fabrics,
        occasions,
        patterns,
        lengths,
        countries,
        colors,
        sizes,
        weights,
        dimensions,
        productTypes,
        catalogs,
        shippingCharges
    };

    await setCache(cacheKey, result, 300); // cache for 5 mins

    sendResponse(res, 200, StatusMessages.SUCCESS, result);
});

export default {
    getAllReferenceData
};
