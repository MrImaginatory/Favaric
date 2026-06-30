import { z } from "zod"
import StatusMessages from "../../configs/message.config.js";

const createDimensionValidation = z.object({
    body: z.object({
        dimensionName: z.string().min(1, "Dimension name is required").max(30, "Dimension name cannot exceed 30 characters"),
        dimensionDescription: z.string().min(1, "Dimension description is required").max(255, "Dimension description cannot exceed 255 characters").optional(),
        dimensionLength: z.number().min(1, "Dimension length is required").max(100000, "Dimension length cannot exceed 100000 characters"),
        dimensionBreadth: z.number().min(1, "Dimension breadth is required").max(100000, "Dimension breadth cannot exceed 100000 characters"),
        dimensionHeight: z.number().min(1, "Dimension height is required").max(100000, "Dimension height cannot exceed 100000 characters"),
        metricId: z.string("Metric is Required").uuid("Metric ID must be a valid UUID"),
    })
})

const updateDimensionValidation = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        dimensionName: z.string().min(1, "Dimension name is required").max(30, "Dimension name cannot exceed 30 characters").optional(),
        dimensionDescription: z.string().min(1, "Dimension description is required").max(255, "Dimension description cannot exceed 255 characters").optional(),
        dimensionLength: z.number().min(1, "Dimension length is required").max(100000, "Dimension length cannot exceed 100000 characters").optional(),
        dimensionBreadth: z.number().min(1, "Dimension breadth is required").max(100000, "Dimension breadth cannot exceed 100000 characters").optional(),
        dimensionHeight: z.number().min(1, "Dimension height is required").max(100000, "Dimension height cannot exceed 100000 characters").optional(),
        metricId: z.string().uuid("Metric ID must be a valid UUID").optional(),
    })
})

const searchDimensionValidation = z.object({
    query: z.object({
        dimension: z.string("Dimension Name is Required and Must be an String").min(1, "Dimension Name minimum length should be 1").max(255, "Dimension Name maximum length should be 255"),
    })
});

export { createDimensionValidation, updateDimensionValidation, searchDimensionValidation }