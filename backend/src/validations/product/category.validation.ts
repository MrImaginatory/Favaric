import { z } from 'zod';
import StatusMessages from '../../configs/message.config.js';

const createCategoryValidation = z.object({
    body: z.object({
        categoryName: z.string("Category Name is required").min(1, "Category Name is required").max(255, "Category Name cannot be more than 255 characters"),
        categoryDescription: z.string("Category Description is required").min(1, "Category Description is required").max(1000, "Category Description cannot be more than 1000 characters"),
        categoryImage: z.string("Category Image is required").min(1, "Category Image is required").optional(),
        isFeatured: z.preprocess((val) => val === 'true' ? true : val === 'false' ? false : val, z.boolean({ message: "Is Featured Should be an Boolean Value" })).optional(),
        isPopular: z.preprocess((val) => val === 'true' ? true : val === 'false' ? false : val, z.boolean({ message: "Is Popular Should be an Boolean Value" })).optional(),
        metaTitle: z.string().min(1, "Meta Title is required").max(255, "Meta Title cannot be more than 255 characters").optional(),
        metaDescription: z.string().min(1, "Meta Description is required").max(1000, "Meta Description cannot be more than 1000 characters").optional(),
        metaKeywords: z.string().min(1, "Meta Keywords is required").max(255, "Meta Keywords cannot be more than 255 characters").optional(),
    })
});

const updateCategoryValidation = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        categoryName: z.string().min(1, "Category Name cannot be empty").max(255, "Category Name cannot be more than 255 characters").optional(),
        categoryDescription: z.string().min(1, "Category Description cannot be empty").max(1000, "Category Description cannot be more than 1000 characters").optional(),
        categoryImage: z.string().min(1, "Category Image cannot be empty").optional(),
        isFeatured: z.preprocess((val) => val === 'true' ? true : val === 'false' ? false : val, z.boolean()).optional(),
        isPopular: z.preprocess((val) => val === 'true' ? true : val === 'false' ? false : val, z.boolean()).optional(),
        metaTitle: z.string().min(1, "Meta Title is required").max(255, "Meta Title cannot be more than 255 characters").optional(),
        metaDescription: z.string().min(1, "Meta Description is required").max(1000, "Meta Description cannot be more than 1000 characters").optional(),
        metaKeywords: z.string().min(1, "Meta Keywords is required").max(255, "Meta Keywords cannot be more than 255 characters").optional(),
    })
});

export {
    createCategoryValidation,
    updateCategoryValidation,
};
