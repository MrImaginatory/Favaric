import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { createMetric, updateMetric, getMetricById, getAllMetrics, deleteMetric, searchMetric } from "../../../../controller/v1/product/metrics.controller.js";
import { createMetricValidation, updateMetricValidation, searchMetricValidation } from "../../../../validations/product/metrics.validation.js";

const metricsRouter = Router();

metricsRouter.post("/addMetric", validate(createMetricValidation), createMetric);
metricsRouter.get("/getMetrics", getAllMetrics);
metricsRouter.get("/getMetric/:id", getMetricById);
metricsRouter.patch("/updateMetric/:id", validate(updateMetricValidation), updateMetric);
metricsRouter.delete("/deleteMetric/:id", deleteMetric);
metricsRouter.get("/searchMetric", validate(searchMetricValidation), searchMetric);

export default metricsRouter;
