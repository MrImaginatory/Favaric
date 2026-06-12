import { Router } from "express";
import userController from "../../../controller/v1/user/user.controller.js";
import { validate } from "../../../middleware/validate.middleware.js";
import { 
    updateProfileSchema, 
    updatePasswordSchema, 
    resetPasswordSchema 
} from "../../../validations/user/auth.validation.js";
import { protect } from "../../../middleware/auth.middleware.js";

const userRouter = Router();

// Profile Management
userRouter.get("/profile", protect, userController.getUserProfile);
userRouter.put("/profile", protect, validate(updateProfileSchema), userController.updateProfile);

// Password Management (Authenticated)
userRouter.post("/update-password", protect, validate(updatePasswordSchema), userController.updatePassword);

// Password Reset (Public)
userRouter.post("/reset-password", validate(resetPasswordSchema), userController.resetPassword);
// updateForgottenPassword uses the exact same underlying controller logic and validation schema
userRouter.post("/update-forgotten-password", validate(resetPasswordSchema), userController.updateForgottenPassword);

export default userRouter;
