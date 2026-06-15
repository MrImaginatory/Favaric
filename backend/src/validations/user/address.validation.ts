import { z } from "zod";

const addAddressSchema = z.object({
    body: z.object({
        addressLine1: z.string().min(10, "Address line 1 must be at least 15 characters long").max(255, "Address line 1 must be at most 255 characters long"),
        addressLine2: z.string().min(5, "Address line 2 must be at least 15 characters long").max(255, "Address line 2 must be at most 255 characters long"),
        city: z.string().min(3, "City must be at least 3 characters long").max(100, "City must be at most 100 characters long"),
        state: z.string().min(3, "State must be at least 3 characters long").max(50, "State must be at most 50 characters long"),
        postalCode: z.string().min(6, "Postal code must be at least 6 characters long").max(6, "Postal code must be at most 6 characters long"),
        country: z.string().min(3, "Country must be at least 3 characters long").max(50, "Country must be at most 50 characters long"),
        isDefault: z.boolean().default(false),
    })
})

const editAddressSchema = z.object({
    body: z.object({
        addressLine1: z.string().min(15, "Address line 1 must be at least 15 characters long").max(255, "Address line 1 must be at most 255 characters long").optional(),
        addressLine2: z.string().min(5, "Address line 2 must be at least 15 characters long").max(255, "Address line 2 must be at most 255 characters long").optional(),
        city: z.string().min(3, "City must be at least 3 characters long").max(100, "City must be at most 100 characters long").optional(),
        state: z.string().min(3, "State must be at least 3 characters long").max(50, "State must be at most 50 characters long").optional(),
        postalCode: z.string().min(6, "Postal code must be at least 6 characters long").max(6, "Postal code must be at most 6 characters long").optional(),
        country: z.string().min(3, "Country must be at least 3 characters long").max(50, "Country must be at most 50 characters long").optional(),
        isDefault: z.boolean().default(false).optional(),
    })
})

export {
    addAddressSchema,
    editAddressSchema
}