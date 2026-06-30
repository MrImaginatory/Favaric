import { z } from "zod";
import StatusMessages from "../../configs/message.config.js";

const createWeightValidation = z.object({
    body: z.object({
        weightName: z.string().min(1, "Weight name is required").max(30, "Weight name cannot exceed 30 characters"),
        weightValue: z.number().min(0, "Weight value is required").max(100000, "Weight value cannot exceed 100000 characters"),
        metricId: z.string("Metric is Required").uuid("Metric ID must be a valid UUID"),
    })
})

const updateWeightValidation = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        weightName: z.string().min(1, "Weight name is required").max(30, "Weight name cannot exceed 30 characters").optional(),
        weightValue: z.number().min(0, "Weight value is required").max(100000, "Weight value cannot exceed 100000 characters").optional(),
        metricId: z.string("Metric is Required").uuid("Metric ID must be a valid UUID").optional(),
    })
})

const searchWeightValidation = z.object({
    query: z.object({
        weight: z.string("Weight Name is Required and Must be an String").min(1, "Weight Name minimum length should be 1").max(255, "Weight Name maximum length should be 255"),
    })
});


export { createWeightValidation, updateWeightValidation, searchWeightValidation }