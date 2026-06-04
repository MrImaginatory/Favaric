import { z } from "zod";
import StatusMessages from "../../configs/message.config.js";

const createLengthValidation = z.object({
    body: z.object({
        lengthName: z.string().min(1, "Length name is required").max(30, "Length name cannot exceed 30 characters"),
        lengthDescription: z.string().min(1, "Length description is required").max(255, "Length description cannot exceed 255 characters"),
        lengthValue: z.number().min(1, "Length value is required").max(100000, "Length value cannot exceed 100000 characters"),
    })
})

const updateLengthValidation = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        lengthName: z.string().min(1, "Length name is required").max(30, "Length name cannot exceed 30 characters").optional(),
        lengthDescription: z.string().min(1, "Length description is required").max(255, "Length description cannot exceed 255 characters").optional(),
        lengthValue: z.number().min(1, "Length value is required").max(100000, "Length value cannot exceed 100000 characters").optional(),
    })
})

export { createLengthValidation, updateLengthValidation }