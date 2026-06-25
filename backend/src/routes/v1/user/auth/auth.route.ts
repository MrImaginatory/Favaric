import { Router } from "express";
import authController from "../../../../controller/v1/user/auth.controller.js";
import sessionController from "../../../../controller/v1/user/session.controller.js";
import { validate } from "../../../../middleware/validate.middleware.js";
import { signupSchema, loginSchema } from "../../../../validations/user/auth.validation.js";
import { protect } from "../../../../middleware/auth.middleware.js";
import { authLimiter } from "../../../../middleware/rateLimiter.middleware.js";

const authRouter = Router();

authRouter.post("/signup", authLimiter, validate(signupSchema), authController.signupController);
authRouter.post("/login", authLimiter, validate(loginSchema), authController.loginController);
authRouter.post("/refresh", authLimiter, authController.refreshTokenController);

// Session management
authRouter.get("/sessions", protect, sessionController.getActiveSessions);
authRouter.delete("/sessions/:sessionId", protect, sessionController.terminateSession);

export default authRouter;
