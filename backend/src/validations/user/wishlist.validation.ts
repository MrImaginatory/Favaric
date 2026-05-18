import { z } from "zod";

const addToWishlistSchema = z.object({
    body: z.object({
        productId: z.number().positive("Please provide a valid product id").int()
    })
})

export {
    addToWishlistSchema
};