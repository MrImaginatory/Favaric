import { z } from "zod";
import StatusMessages from "../../configs/message.config.js";

const createProductTypeValidation = z.object({
    body: z.object({
        productTypeName: z.string().min(1, "Product type name is required").max(30, "Product type name cannot exceed 30 characters"),
        productTypeDescription: z.string().min(1, "Product type description is required").max(255, "Product type description cannot exceed 255 characters"),
    })
})

const updateProductTypeValidation = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        productTypeName: z.string().min(1, "Product type name is required").max(30, "Product type name cannot exceed 30 characters").optional(),
        productTypeDescription: z.string().min(1, "Product type description is required").max(255, "Product type description cannot exceed 255 characters").optional(),
    })
})

const searchProductTypeValidation = z.object({
    query: z.object({
        productType: z.string("Product Type Name is Required and Must be an String").min(1, "Product Type Name minimum length should be 1").max(255, "Product Type Name maximum length should be 255"),
    })
});


export { createProductTypeValidation, updateProductTypeValidation, searchProductTypeValidation }