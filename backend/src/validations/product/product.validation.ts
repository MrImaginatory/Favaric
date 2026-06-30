import { z } from 'zod';
import StatusMessages from '../../configs/message.config.js';

const booleanString = z.union([
    z.boolean(),
    z.string().transform((val) => val === 'true' || val === '1')
]);

const createProductValidation = z.object({
    body: z.object({
        productName: z.string().min(1, "Product Name is required").max(255, "Product Name cannot exceed 255 characters"),
        productTitle: z.string().min(1, "Product Title is required").max(255, "Product Title cannot exceed 255 characters"),
        productDescription: z.string().min(1, "Product Description is required").max(2000, "Product Description cannot exceed 2000 characters"),
        regularPrice: z.coerce.number().min(0, "Regular Price must be greater than or equal to 0"),
        salePrice: z.coerce.number().min(0, "Sale Price must be greater than or equal to 0").optional(),
        currency: z.string().min(1, "Currency is required").max(10, "Currency cannot exceed 10 characters").optional(),
        gstPercentage: z.coerce.number().min(0, "GST Percentage must be greater than or equal to 0").max(100, "GST cannot exceed 100"),
        category: z.string().uuid("Invalid Category ID"),
        brand: z.string().uuid("Invalid Brand ID"),
        thumbnailImage: z.string().optional(),
        image: z.string().optional(),
        subImages: z.any().optional(),
        stock: z.coerce.number().int().min(0, "Stock must be 0 or more").optional(),
        maxOrderQty: z.coerce.number().int().min(1, "Max Order Quantity must be at least 1").optional(),
        minOrderQty: z.coerce.number().int().min(1, "Min Order Quantity must be at least 1").optional(),
        designCode: z.string().max(100, "Design Code cannot exceed 100 characters").optional(),
        sku: z.string().max(100, "SKU cannot exceed 100 characters").optional(),
        hsn: z.string().max(50, "HSN cannot exceed 50 characters").optional(),
        fabric: z.string().uuid("Invalid Fabric ID").optional().nullable(),
        occasion: z.string().uuid("Invalid Occasion ID").optional().nullable(),
        pattern: z.string().uuid("Invalid Pattern ID").optional().nullable(),
        length: z.string().uuid("Invalid Length ID").optional().nullable(),
        transparency: z.string().max(50, "Transparency cannot exceed 50 characters").optional(),
        countryOfOrigin: z.string().uuid("Invalid Country of Origin ID").optional().nullable(),
        color: z.string().uuid("Invalid Color ID").optional().nullable(),
        size: z.string().uuid("Invalid Size ID").optional().nullable(),
        weight: z.string().uuid("Invalid Weight ID").optional().nullable(),
        dimensions: z.string().uuid("Invalid Dimensions ID").optional().nullable(),
        isFeatured: booleanString.optional(),
        isTrending: booleanString.optional(),
        isNewArrival: booleanString.optional(),
        isDiscounted: booleanString.optional(),
        isAvailable: booleanString.optional(),
        isCatalog: booleanString.optional(),
        catalogId: z.string().uuid("Invalid Catalog ID").optional().nullable(),
        isPinned: booleanString.optional(),
        pinPosition: z.coerce.number().int().optional().nullable(),
        productType: z.string().uuid("Invalid Product Type ID").optional().nullable(),
        quantityPerUnit: z.coerce.string().optional(),
        shippingCharge: z.string().uuid("Invalid Shipping Charge ID").optional().nullable(),
        productStitched: booleanString.optional(),
        moq: z.coerce.number().int().min(1).optional(),
        otherDetails: z.any().optional(),
        metaTitle: z.string().max(255).optional(),
        metaDescription: z.string().max(1000).optional(),
        metaKeywords: z.string().max(255).optional(),
        productSlug: z.string().max(255).optional()
    })
});

const updateProductValidation = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        productName: z.string().min(1).max(255).optional(),
        productTitle: z.string().min(1).max(255).optional(),
        productDescription: z.string().min(1).max(2000).optional(),
        regularPrice: z.coerce.number().min(0).optional(),
        salePrice: z.coerce.number().min(0).optional(),
        currency: z.string().min(1).max(10).optional(),
        gstPercentage: z.coerce.number().min(0).max(100).optional(),
        category: z.string().uuid("Invalid Category ID").optional(),
        brand: z.string().uuid("Invalid Brand ID").optional(),
        thumbnailImage: z.string().optional(),
        image: z.string().optional(),
        subImages: z.any().optional(),
        stock: z.coerce.number().int().min(0).optional(),
        maxOrderQty: z.coerce.number().int().min(1).optional(),
        minOrderQty: z.coerce.number().int().min(1).optional(),
        designCode: z.string().max(100).optional(),
        sku: z.string().max(100).optional(),
        hsn: z.string().max(50).optional(),
        fabric: z.string().uuid("Invalid Fabric ID").optional().nullable(),
        occasion: z.string().uuid("Invalid Occasion ID").optional().nullable(),
        pattern: z.string().uuid("Invalid Pattern ID").optional().nullable(),
        length: z.string().uuid("Invalid Length ID").optional().nullable(),
        transparency: z.string().max(50).optional(),
        countryOfOrigin: z.string().uuid("Invalid Country of Origin ID").optional().nullable(),
        color: z.string().uuid("Invalid Color ID").optional().nullable(),
        size: z.string().uuid("Invalid Size ID").optional().nullable(),
        weight: z.string().uuid("Invalid Weight ID").optional().nullable(),
        dimensions: z.string().uuid("Invalid Dimensions ID").optional().nullable(),
        isFeatured: booleanString.optional(),
        isTrending: booleanString.optional(),
        isNewArrival: booleanString.optional(),
        isDiscounted: booleanString.optional(),
        isAvailable: booleanString.optional(),
        isCatalog: booleanString.optional(),
        catalogId: z.string().uuid("Invalid Catalog ID").optional().nullable(),
        isPinned: booleanString.optional(),
        pinPosition: z.coerce.number().int().optional().nullable(),
        productType: z.string().uuid("Invalid Product Type ID").optional().nullable(),
        quantityPerUnit: z.coerce.string().optional(),
        shippingCharge: z.string().uuid("Invalid Shipping Charge ID").optional().nullable(),
        productStitched: booleanString.optional(),
        moq: z.coerce.number().int().min(1).optional(),
        otherDetails: z.any().optional(),
        metaTitle: z.string().max(255).optional(),
        metaDescription: z.string().max(1000).optional(),
        metaKeywords: z.string().max(255).optional(),
        productSlug: z.string().max(255).optional()
    })
});

const searchProductValidation = z.object({
    query: z.object({
        product: z.string("Product query is Required and Must be a String").min(1, "Query minimum length should be 1").max(255, "Query maximum length should be 255"),
    })
});

export {
    createProductValidation,
    updateProductValidation,
    searchProductValidation
};
