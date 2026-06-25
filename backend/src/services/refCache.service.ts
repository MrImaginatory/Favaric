import Category from "../models/product/category.model.js";
import Brand from "../models/product/brand.model.js";
import Fabric from "../models/product/fabric.model.js";
import Occasion from "../models/product/occasion.model.js";
import Pattern from "../models/product/pattern.model.js";
import Length from "../models/product/length.model.js";
import CountryOfOrigin from "../models/product/countryOfOrigin.model.js";
import Color from "../models/product/color.model.js";
import Size from "../models/product/size.model.js";
import Weight from "../models/product/weight.model.js";
import Dimensions from "../models/product/dimension.model.js";
import ProductType from "../models/product/productType.model.js";
import ShippingCharge from "../models/product/shippingCharge.model.js";
import Catalog from "../models/product/catalog.model.js";
import { getCache, setCache, deleteCache } from "./cache.service.js";
import logger from "../utils/logger.util.js";

const REF_CACHE_TTL = 600;

interface RefConfig {
    model: any;
    keyField: string;
    cachePrefix: string;
    label: string;
}

const REF_CONFIGS: RefConfig[] = [
    { model: Category, keyField: "categoryId", cachePrefix: "ref:categories", label: "Category" },
    { model: Brand, keyField: "brandId", cachePrefix: "ref:brands", label: "Brand" },
    { model: Fabric, keyField: "fabricId", cachePrefix: "ref:fabrics", label: "Fabric" },
    { model: Occasion, keyField: "occasionId", cachePrefix: "ref:occasions", label: "Occasion" },
    { model: Pattern, keyField: "patternId", cachePrefix: "ref:patterns", label: "Pattern" },
    { model: Length, keyField: "lengthId", cachePrefix: "ref:lengths", label: "Length" },
    { model: CountryOfOrigin, keyField: "countryOfOriginId", cachePrefix: "ref:countries", label: "Country of Origin" },
    { model: Color, keyField: "colorId", cachePrefix: "ref:colors", label: "Color" },
    { model: Size, keyField: "sizeId", cachePrefix: "ref:sizes", label: "Size" },
    { model: Weight, keyField: "weightId", cachePrefix: "ref:weights", label: "Weight" },
    { model: Dimensions, keyField: "dimensionId", cachePrefix: "ref:dimensions", label: "Dimensions" },
    { model: ProductType, keyField: "productTypeId", cachePrefix: "ref:productTypes", label: "Product Type" },
    { model: ShippingCharge, keyField: "shippingChargeId", cachePrefix: "ref:shippingCharges", label: "Shipping Charge" },
    { model: Catalog, keyField: "catalogId", cachePrefix: "ref:catalogs", label: "Catalog" },
];

export const loadRefData = async (config: RefConfig): Promise<Set<string>> => {
    const cached = await getCache<string[]>(config.cachePrefix);
    if (cached) {
        return new Set(cached);
    }

    const records = await config.model.findAll({
        attributes: [config.keyField],
        where: { deletedAt: null } as any,
    });

    const ids = records.map((r: any) => r[config.keyField]);
    await setCache(config.cachePrefix, ids, REF_CACHE_TTL);
    return new Set(ids);
};

export const loadAllRefData = async (): Promise<void> => {
    logger.log("Loading reference data into cache...");
    for (const config of REF_CONFIGS) {
        await loadRefData(config);
    }
    logger.success("Reference data cached successfully.");
};

export const refreshRefData = async (prefix: string): Promise<void> => {
    await deleteCache(prefix);
};

export const validateReference = async (model: any, keyField: string, value: string): Promise<boolean> => {
    const config = REF_CONFIGS.find(c => c.model === model);
    if (!config) {
        const record = await model.findOne({ where: { [keyField]: value } as any });
        return record !== null;
    }

    const ids = await loadRefData(config);
    return ids.has(value);
};

export const buildReferenceChecks = (
    fields: Array<{ value: string | undefined; model: any; keyField: string; name: string }>
): Array<{ value: string; model: any; keyField: string; name: string }> => {
    return fields
        .filter(f => f.value !== undefined)
        .map(f => ({ value: f.value!, model: f.model, keyField: f.keyField, name: f.name }));
};

export const validateAllReferences = async (
    checks: Array<{ value: string; model: any; keyField: string; name: string }>
): Promise<string | null> => {
    for (const check of checks) {
        const exists = await validateReference(check.model, check.keyField, check.value);
        if (!exists) {
            return check.name;
        }
    }
    return null;
};

export { REF_CONFIGS };
