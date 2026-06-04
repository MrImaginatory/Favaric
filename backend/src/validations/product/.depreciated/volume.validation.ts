import { z } from "zod";
import StatusMessages from "../../../configs/message.config.js";

const createVolume = z.object({
    body: z.object({
        volumeName: z.string().min(1, "Volume name is required").max(30, "Volume name cannot exceed 30 characters"),
        volumeValue: z.string().min(1, "Volume value is required").max(30, "Volume value cannot exceed 30 characters"),
    })
})

const updateVolume = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        volumeName: z.string().min(1, "Volume name is required").max(30, "Volume name cannot exceed 30 characters").optional(),
        volumeValue: z.string().min(1, "Volume value is required").max(30, "Volume value cannot exceed 30 characters").optional(),
    })
})

export { createVolume, updateVolume }
