import { z } from 'zod';
import StatusMessages from '../../configs/message.config.js';

const createSubCategoryValidation = z.object({
    body: z.object({
        subcategoryName: z.string("SubCategory Name is required").min(1, "SubCategory Name is required").max(255, "SubCategory Name cannot be more than 255 characters"),
        categoryId: z.string("Category ID is required").regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, "Invalid Category ID"),
        subcategoryDescription: z.string("SubCategory Description is required").min(1, "SubCategory Description is required").max(1000, "SubCategory Description cannot be more than 1000 characters").optional(),
        subcategoryImage: z.string().optional(),
        isFeatured: z.boolean().optional(),
        isPopular: z.boolean().optional(),
        metaTitle: z.string().min(1, "Meta Title is required").max(255, "Meta Title cannot be more than 255 characters").optional(),
        metaDescription: z.string().min(1, "Meta Description is required").max(1000, "Meta Description cannot be more than 1000 characters").optional(),
        metaKeywords: z.string().min(1, "Meta Keywords is required").max(255, "Meta Keywords cannot be more than 255 characters").optional(),
    })
});

const updateSubCategoryValidation = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        subcategoryName: z.string().min(1, "SubCategory Name cannot be empty").max(255, "SubCategory Name cannot be more than 255 characters").optional(),
        categoryId: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, "Invalid Category ID").optional(),
        subcategoryDescription: z.string().min(1, "SubCategory Description cannot be empty").max(1000, "SubCategory Description cannot be more than 1000 characters").optional(),
        subcategoryImage: z.string().min(1, "SubCategory Image cannot be empty").max(255, "SubCategory Image cannot be more than 255 characters").optional(),
        isFeatured: z.boolean().optional(),
        isPopular: z.boolean().optional(),
        metaTitle: z.string().min(1, "Meta Title is required").max(255, "Meta Title cannot be more than 255 characters").optional(),
        metaDescription: z.string().min(1, "Meta Description is required").max(1000, "Meta Description cannot be more than 1000 characters").optional(),
        metaKeywords: z.string().min(1, "Meta Keywords is required").max(255, "Meta Keywords cannot be more than 255 characters").optional(),
    })
});

export {
    createSubCategoryValidation,
    updateSubCategoryValidation,
};
