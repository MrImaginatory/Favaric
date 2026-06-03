import { z } from 'zod';

const createBrandValidation = z.object({
    brandName: z.string().min(1, "Brand name is required"),
    brandDescription: z.string().min(1, "Brand description is required"),
    brandIcon: z.string().min(1, "Brand icon is required"),
    brandType: z.enum(["PREMIUM", "REGULAR"])
});

const updateBrandValidation = z.object({
    brandName: z.string().min(1, "Brand name is required").optional(),
    brandDescription: z.string().min(1, "Brand description is required").optional(),
    brandIcon: z.string().min(1, "Brand icon is required").optional(),
    brandType: z.enum(["PREMIUM", "REGULAR"]).optional()
});

export {
    createBrandValidation,
    updateBrandValidation,
};

