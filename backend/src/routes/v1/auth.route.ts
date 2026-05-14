import { Router } from "express";
import authController from "../../controller/v1/user/auth.controller.js";
import sessionController from "../../controller/v1/user/session.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { signupSchema, loginSchema } from "../../validations/auth.validation.js";
import { protect } from "../../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/signup", validate(signupSchema), authController.signupController);
authRouter.post("/login", validate(loginSchema), authController.loginController);

// Session management
authRouter.get("/sessions", protect, sessionController.getActiveSessions);
authRouter.delete("/sessions/:sessionId", protect, sessionController.terminateSession);

export default authRouter;
