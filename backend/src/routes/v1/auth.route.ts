import { Router } from "express";
import authController from "../../controller/v1/user/auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { signupSchema, loginSchema } from "../../validations/auth.validation.js";

const authRouter = Router();

authRouter.post("/signup", validate(signupSchema), authController.signupController);
authRouter.post("/login", validate(loginSchema), authController.loginController);

export default authRouter;
