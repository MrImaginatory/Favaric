import { z } from "zod";
import StatusMessages from "../../configs/message.config.js";

const createSizeValidation = z.object({
    body: z.object({
        sizeName: z.string().min(1, "Size name is required").max(30, "Size name cannot exceed 30 characters"),
        sizeValue: z.string().min(1, "Size value is required").max(30, "Size value cannot exceed 30 characters"),
    })
})

const updateSizeValidation = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        sizeName: z.string().min(1, "Size name is required").max(30, "Size name cannot exceed 30 characters").optional(),
        sizeValue: z.string().min(1, "Size value is required").max(30, "Size value cannot exceed 30 characters").optional(),
    })
})

const searchSizeValidation = z.object({
    query: z.object({
        size: z.string("Size Name is Required and Must be an String").min(1, "Size Name minimum length should be 1").max(255, "Size Name maximum length should be 255"),
    })
});


export { createSizeValidation, updateSizeValidation, searchSizeValidation }