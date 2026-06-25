import { z } from 'zod';
import StatusMessages from '../../configs/message.config.js';

const createBrandValidation = z.object({
    body: z.object({
        brandName: z.string("Brand Name is Required and Must be an String").min(1, "Brand Name minimum length should be 1").max(255, "Brand Name maximum length should be 255"),
        brandDescription: z.string("Brand Description is Required and Must be an String").min(1, "Brand Description minimum length should be 1").max(1000, "Brand Description maximum length should be 1000"),
        brandLogo: z.string("Brand Logo is Required and Must be an String").min(1, "Brand Logo minimum length should be 1").max(255, "Brand Logo maximum length should be 255").optional(),
    })
});

const updateBrandValidation = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        brandName: z.string("Brand Name is Required and Must be an String").min(1, "Brand Name minimum length should be 1").max(255, "Brand Name maximum length should be 255").optional(),
        brandDescription: z.string("Brand Description is Required and Must be an String").min(1, "Brand Description minimum length should be 1").max(1000, "Brand Description maximum length should be 1000").optional(),
        brandLogo: z.string("Brand Logo is Required and Must be an String").min(1, "Brand Logo minimum length should be 1").max(255, "Brand Logo maximum length should be 255").optional(),
    })
});

const searchBrandValidation = z.object({
    query: z.object({
        brand: z.string("Brand Name is Required and Must be an String").min(1, "Brand Name minimum length should be 1").max(255, "Brand Name maximum length should be 255"),
    })
});

export {
    createBrandValidation,
    updateBrandValidation,
    searchBrandValidation,
};

