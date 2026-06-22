import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createColor, getColors, getColorById, updateColor, deleteColor, searchColors } from "../../../../controller/v1/product/color.controller.js";
import { addColorValidation, editColorValidation } from "../../../../validations/product/color.validation.js";

const colorRouter = Router();

colorRouter.post("/addColor", validate(addColorValidation), createColor);
colorRouter.get("/getColors", getColors);
colorRouter.get("/getColor/:id", validate(uuidValidation), getColorById);
colorRouter.patch("/updateColor/:id", validate(editColorValidation), updateColor);
colorRouter.delete("/deleteColor/:id", validate(uuidValidation), deleteColor);
colorRouter.get("/searchColor", searchColors)

export default colorRouter;
