import { Router } from "express";
import authController from "../../controller/v1/user/auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { signupSchema } from "../../validations/auth.validation.js";

const router = Router();

/**
 * @route   POST /api/v1/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post(
    "/signup", 
    validate(signupSchema), // The validation happens HERE
    authController.signupController
);

export default router;
