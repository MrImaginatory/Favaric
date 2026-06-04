import { z } from "zod";
import StatusMessages from "../../configs/message.config.js";

const createFabric = z.object({
    body: z.object({
        fabricName: z.string().min(1, "Fabric name is required").max(30, "Fabric name cannot exceed 30 characters"),
        fabricDescription: z.string().min(1, "Fabric description is required").max(255, "Fabric description cannot exceed 255 characters"),
    })
})

const updateFabric = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        fabricName: z.string().min(1, "Fabric name is required").max(30, "Fabric name cannot exceed 30 characters").optional(),
        fabricDescription: z.string().min(1, "Fabric description is required").max(255, "Fabric description cannot exceed 255 characters").optional(),
    })
})

export { createFabric, updateFabric }