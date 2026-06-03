import { z } from "zod";

const addColorValidation = z.object({
    body: z.object({
        colorName: z.string("Color name must be a string").min(3, "Color name must be at least 3 characters long").max(50, "Color name must be at most 50 characters long").trim(),
        colorCode: z.string("Color code must be a string").regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex code").trim(),
    })
})

const editColorValidation = z.object({
    params: z.object({
        id: z.string("ID must be a string").uuid("Invalid ID"),
    }),
    body: z.object({
        colorName: z.string("Color name must be a string").min(3, "Color name must be at least 3 characters long").max(50, "Color name must be at most 50 characters long").optional(),
        colorCode: z.string("Color code must be a string").min(3, "Color code must be at least 3 characters long").max(50, "Color code must be at most 50 characters long").optional(),
    })
})

const uuidValidation = z.object({
    params: z.object({
        id: z.string("ID must be a string").uuid("Invalid ID"),
    })
})


export {
    addColorValidation,
    editColorValidation,
    uuidValidation as colorIdValidation,
}