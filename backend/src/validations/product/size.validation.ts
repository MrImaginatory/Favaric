import { z } from "zod";
import StatusMessages from "../../configs/message.config.js";

const createSize = z.object({
    body: z.object({
        sizeName: z.string().min(1, "Size name is required").max(30, "Size name cannot exceed 30 characters"),
        sizeValue: z.string().min(1, "Size value is required").max(30, "Size value cannot exceed 30 characters"),
    })
})

const updateSize = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        sizeName: z.string().min(1, "Size name is required").max(30, "Size name cannot exceed 30 characters").optional(),
        sizeValue: z.string().min(1, "Size value is required").max(30, "Size value cannot exceed 30 characters").optional(),
    })
})

export { createSize, updateSize }