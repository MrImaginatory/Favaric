import { z } from 'zod';
import StatusMessages from '../../configs/message.config.js';

const createBrandValidation = z.object({
    body: z.object({
        brandName: z.string().min(1, "Brand name is required"),
        brandDescription: z.string().min(1, "Brand description is required"),
        brandIcon: z.string().min(1, "Brand icon is required"),
        brandType: z.enum(["PREMIUM", "REGULAR"])
    })
});

const updateBrandValidation = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        brandName: z.string().min(1, "Brand name is required").optional(),
        brandDescription: z.string().min(1, "Brand description is required").optional(),
        brandIcon: z.string().min(1, "Brand icon is required").optional(),
        brandType: z.enum(["PREMIUM", "REGULAR"]).optional()
    })
});

export {
    createBrandValidation,
    updateBrandValidation,
};

