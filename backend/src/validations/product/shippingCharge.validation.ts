import { z } from "zod";
import StatusMessages from "../../configs/message.config.js";

const createShippingCharge = z.object({
    body: z.object({
        shippingBaseCountry: z.string().min(1, "Shipping base country is required").max(30, "Shipping base country cannot exceed 30 characters"),
        shippingPrice: z.number().min(1, "Shipping price is required").max(100000000, "Shipping price cannot exceed 100000 characters"),
        isFreeShipping: z.boolean().optional(),
        shippingMinimumOrderAmount: z.number().min(1, "Shipping minimum order amount is required").max(100000000, "Shipping minimum order amount cannot exceed 100000 characters").optional(),
        shippingWeightSlabFrom: z.number().min(1, "Shipping weight slab from is required").max(100000000, "Shipping weight slab from cannot exceed 100000 characters"),
        shippingWeightSlabTo: z.number().min(1, "Shipping weight slab to is required").max(1000000, "Shipping weight slab to cannot exceed 100000 characters"),
        shippingStatus: z.enum(["ACTIVE", "INACTIVE"]),
    })
})

const updateShippingCharge = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        shippingBaseCountry: z.string().min(1, "Shipping base country is required").max(30, "Shipping base country cannot exceed 30 characters").optional(),
        shippingPrice: z.number().min(1, "Shipping price is required").max(100000000, "Shipping price cannot exceed 100000 characters").optional(),
        isFreeShipping: z.boolean().optional(),
        shippingMinimumOrderAmount: z.number().min(1, "Shipping minimum order amount is required").max(100000000, "Shipping minimum order amount cannot exceed 100000 characters").optional(),
        shippingWeightSlabFrom: z.number().min(1, "Shipping weight slab from is required").max(10000000, "Shipping weight slab from cannot exceed 100000 characters").optional(),
        shippingWeightSlabTo: z.number().min(1, "Shipping weight slab to is required").max(1000000, "Shipping weight slab to cannot exceed 100000 characters").optional(),
        shippingStatus: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    })
})

export { createShippingCharge, updateShippingCharge }