import { z } from 'zod';
import StatusMessages from '../../configs/message.config.js';

const createCatalogValidation = z.object({
    body: z.object({
        catalogName: z.string("Catalog Name is required").min(1, "Catalog Name is required").max(255, "Catalog Name cannot be more than 255 characters"),
        catalogDescription: z.string("Catalog Description is required").min(1, "Catalog Description is required").max(1000, "Catalog Description cannot be more than 1000 characters"),
        catalogImage: z.string("Catalog Image is required").min(1, "Catalog Image is required").max(255, "Catalog Image cannot be more than 255 characters").optional(),
        catalogSubImages: z.any().optional(), // Can be stringified JSON or array depending on multer/body parsing
        metaTitle: z.string().min(1, "Meta Title is required").max(255, "Meta Title cannot be more than 255 characters").optional(),
        metaDescription: z.string().min(1, "Meta Description is required").max(1000, "Meta Description cannot be more than 1000 characters").optional(),
        metaKeywords: z.string().min(1, "Meta Keywords is required").max(255, "Meta Keywords cannot be more than 255 characters").optional(),
    })
});

const updateCatalogValidation = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        catalogName: z.string().min(1, "Catalog Name cannot be empty").max(255, "Catalog Name cannot be more than 255 characters").optional(),
        catalogDescription: z.string().min(1, "Catalog Description cannot be empty").max(1000, "Catalog Description cannot be more than 1000 characters").optional(),
        catalogImage: z.string().min(1, "Catalog Image cannot be empty").max(255, "Catalog Image cannot be more than 255 characters").optional(),
        catalogSubImages: z.any().optional(),
        metaTitle: z.string().min(1, "Meta Title is required").max(255, "Meta Title cannot be more than 255 characters").optional(),
        metaDescription: z.string().min(1, "Meta Description is required").max(1000, "Meta Description cannot be more than 1000 characters").optional(),
        metaKeywords: z.string().min(1, "Meta Keywords is required").max(255, "Meta Keywords cannot be more than 255 characters").optional(),
    })
});

const searchCatalogValidation = z.object({
    query: z.object({
        catalog: z.string("Catalog Name is Required and Must be an String").min(1, "Catalog Name minimum length should be 1").max(255, "Catalog Name maximum length should be 255"),
    })
});


export {
    createCatalogValidation,
    updateCatalogValidation,
    searchCatalogValidation
};
