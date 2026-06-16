import { Router } from "express";
import { checkHealth } from "../controller/health.controller.js";
import requestLogger from "../middleware/requestLogger.middleware.js";
import { checkDbHealth } from "../controller/health.controller.js";

const healthRouter = Router();

healthRouter.get("/health", requestLogger, checkHealth);
healthRouter.get("/db-health", requestLogger, checkDbHealth);

export default healthRouter;
