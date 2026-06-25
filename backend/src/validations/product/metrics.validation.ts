import { z } from "zod";
import StatusMessages from "../../configs/message.config.js";

const createMetricValidation = z.object({
    body: z.object({
        metricName: z.string().min(1, "Metric name is required").max(30, "Metric name cannot exceed 30 characters"),
    })
});

const updateMetricValidation = z.object({
    params: z.object({
        id: z.string().uuid(StatusMessages.NOT_FOUND),
    }),
    body: z.object({
        metricName: z.string().min(1, "Metric name is required").max(30, "Metric name cannot exceed 30 characters").optional(),
    })
});

const searchMetricValidation = z.object({
    query: z.object({
        metric: z.string().min(1, "Metric name is required").max(255, "Metric name cannot exceed 255 characters"),
    })
});

export { createMetricValidation, updateMetricValidation, searchMetricValidation };
