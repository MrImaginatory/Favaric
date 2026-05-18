import { z } from "zod";

const addToCartSchema = z.object({
    body: z.object({
        productId: z.number().int("Product ID must be an integer"),
        quantity: z.number().int("Quantity must be an integer").positive("Quantity must be a positive number"),
    })
})

const updateCartSchema = z.object({
    body: z.object({
        productId: z.number().int("Product ID must be an integer"),
        quantity: z.number().int("Quantity must be an integer").positive("Quantity must be a positive number"),
    })
})

const removeFromCartSchema = z.object({
    query: z.object({
        productId: z.number().int("Product ID must be an integer"),
    })
})

export {
    addToCartSchema,
    updateCartSchema,
    removeFromCartSchema
}