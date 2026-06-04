import { z } from "zod";
import StatusMessages from "../../configs/message.config.js";

const createOccasion = z.object({
    body: z.object({
        occasionName: z.string().min(1, "Occasion name is required").max(30, "Occasion name cannot exceed 30 characters"),
        occasionDescription: z.string().min(1, "Occasion description is required").max(255, "Occasion description cannot exceed 255 characters"),
    })
})

const updateOccasion = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        occasionName: z.string().min(1, "Occasion name is required").max(30, "Occasion name cannot exceed 30 characters").optional(),
        occasionDescription: z.string().min(1, "Occasion description is required").max(255, "Occasion description cannot exceed 255 characters").optional(),
    })
})

export { createOccasion, updateOccasion }