import { z } from "zod";
import StatusMessages from "../../configs/message.config.js";

const addColorValidation = z.object({
    body: z.object({
        colorName: z.string("Color name must be a string").min(3, "Color name must be at least 3 characters long").max(50, "Color name must be at most 50 characters long").trim(),
        colorCode: z.string("Color code must be a string").regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex code").trim(),
    })
})

const editColorValidation = z.object({
    params: z.object({
        id: z.string("ID must be a string").regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        colorName: z.string("Color name must be a string").min(3, "Color name must be at least 3 characters long").max(50, "Color name must be at most 50 characters long").optional(),
        colorCode: z.string("Color code must be a string").min(3, "Color code must be at least 3 characters long").max(50, "Color code must be at most 50 characters long").optional(),
    })
})

const searchColorValidation = z.object({
    query: z.object({
        color: z.string("Color Name is Required and Must be an String").min(1, "Color Name minimum length should be 1").max(255, "Color Name maximum length should be 255"),
    })
});


export {
    addColorValidation,
    editColorValidation,
    searchColorValidation
}