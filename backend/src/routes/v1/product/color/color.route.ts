import { Router } from "express";
import { createColor, getColors, getColorById, updateColor, deleteColor } from "../../../../controller/v1/product/color.controller.js";
import protect from "../../../../middleware/auth.middleware.js";
import { validate } from "../../../../middleware/validate.middleware.js";
import { addColorValidation, editColorValidation, colorIdValidation } from "../../../../validations/product/color.validation.js";

const colorRouter = Router();

colorRouter.post("/addColor", protect, validate(addColorValidation), createColor);
colorRouter.get("/getColors", protect, getColors);
colorRouter.get("/getColor/:id", protect, validate(colorIdValidation), getColorById);
colorRouter.patch("/updateColor/:id", protect, validate(editColorValidation), updateColor);
colorRouter.delete("/deleteColor/:id", protect, validate(colorIdValidation), deleteColor);

export default colorRouter;
