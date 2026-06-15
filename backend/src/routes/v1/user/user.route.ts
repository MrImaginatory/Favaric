import { Router } from "express";
import userController from "../../../controller/v1/user/user.controller.js";
import { validate } from "../../../middleware/validate.middleware.js";
import {
    updateProfileSchema,
    updatePasswordSchema,
    resetPasswordSchema,
    forgotPasswordSchema
} from "../../../validations/user/auth.validation.js";
import { protect } from "../../../middleware/auth.middleware.js";
import upload from "../../../middleware/multer.middleware.js";

const userRouter = Router();

userRouter.get("/profile", protect, userController.getUserProfile);
userRouter.put("/updateProfile", protect, upload("user/profile").single("profilePicture"), validate(updateProfileSchema), userController.updateProfile);

userRouter.post("/updatePassword", protect, validate(updatePasswordSchema), userController.updatePassword);

userRouter.post("/forgotPassword", validate(forgotPasswordSchema), userController.forgotPassword);
userRouter.post("/resetPassword", validate(resetPasswordSchema), userController.resetPassword);
userRouter.post("/updateForgottenPassword", validate(resetPasswordSchema), userController.updateForgottenPassword);

export default userRouter;
