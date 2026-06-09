import { z } from "zod"
import StatusMessages from "../../configs/message.config.js";

const createCountryOriginValidation = z.object({
    body: z.object({
        countryOfOriginName: z.string("Country Name is Required and Must be an String").min(1, "Country Name minimum length should be 1").max(255, "Country Name maximum length should be 255"),
        countryOfOriginDescription: z.string("Country Description is Required and Must be an String").min(1, "Country Description minimum length should be 1").max(255, "Country Description maximum length should be 255"),
    })
})

const updateCountryOriginValidation = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        countryOfOriginName: z.string("Country Name is Required and Must be an String").min(1, "Country Name minimum length should be 1").max(255, "Country Name maximum length should be 255").optional(),
        countryOfOriginDescription: z.string("Country Description is Required and Must be an String").min(1, "Country Description minimum length should be 1").max(255, "Country Description maximum length should be 255").optional(),
    })
})

export { createCountryOriginValidation, updateCountryOriginValidation }