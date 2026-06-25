import { z } from "zod";
import StatusMessages from "../../configs/message.config.js";

const createPatternValidation = z.object({
    body: z.object({
        patternName: z.string().min(1, "Pattern name is required").max(30, "Pattern name cannot exceed 30 characters"),
        patternDescription: z.string().min(1, "Pattern description is required").max(255, "Pattern description cannot exceed 255 characters"),
    })
})

const updatePatternValidation = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        patternName: z.string().min(1, "Pattern name is required").max(30, "Pattern name cannot exceed 30 characters").optional(),
        patternDescription: z.string().min(1, "Pattern description is required").max(255, "Pattern description cannot exceed 255 characters").optional(),
    })
})

const searchPatternValidation = z.object({
    query: z.object({
        pattern: z.string("Pattern Name is Required and Must be an String").min(1, "Pattern Name minimum length should be 1").max(255, "Pattern Name maximum length should be 255"),
    })
});


export { createPatternValidation, updatePatternValidation, searchPatternValidation }
