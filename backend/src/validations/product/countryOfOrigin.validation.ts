import { z } from "zod"
import StatusMessages from "../../configs/message.config.js";

const createCountryOriginValidation = z.object({
    body: z.object({
        countryName: z.string().min(1, "Country name is required").max(100, "Country name cannot exceed 100 characters"),
        countryDescription: z.string().min(1, "Country description is required").max(255, "Country description cannot exceed 255 characters"),
    })
})

const updateCountryOriginValidation = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        countryName: z.string().min(1, "Country name is required").max(100, "Country name cannot exceed 100 characters").optional(),
        countryDescription: z.string().min(1, "Country description is required").max(255, "Country description cannot exceed 255 characters").optional(),
    })
})

export { createCountryOriginValidation, updateCountryOriginValidation }