import { Router } from "express";
import { showStatusPage, showStatusJson } from "../controller/status.controller.js";
import requestLogger from "../middleware/requestLogger.middleware.js";

const statusRouter = Router();

// HTML status dashboard
statusRouter.get("/status", requestLogger, showStatusPage);

// JSON status endpoints (both standard and nested under status/json)
statusRouter.get("/status/json", requestLogger, showStatusJson);
statusRouter.get("/api/v1/status", requestLogger, showStatusJson);

export default statusRouter;
