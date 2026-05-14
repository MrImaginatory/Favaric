import { Router } from "express";
import { checkHealth } from "../controller/health.controller.js";
import requestLogger from "../middleware/requestLogger.middleware.js";
import { checkDbHealth } from "../controller/health.controller.js";
import protect from "../middleware/auth.middleware.js";

const healthRouter = Router();

healthRouter.get("/health", requestLogger, protect, checkHealth);
healthRouter.get("/db-health", requestLogger, protect, checkDbHealth);

export default healthRouter;
