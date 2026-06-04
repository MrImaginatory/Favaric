import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createDimension, updateDimension, getAllDimensions, getDimensionById, deleteDimension } from "../../../../controller/v1/product/dimension.controller.js";
import { createDimensionValidation, updateDimensionValidation } from "../../../../validations/product/dimension.validation.js";

const dimensionRouter = Router();

dimensionRouter.post("/", validate(createDimensionValidation), createDimension);
dimensionRouter.put("/:id", validate(updateDimensionValidation), updateDimension);
dimensionRouter.delete("/:id", validate(uuidValidation), deleteDimension);
dimensionRouter.get("/:id", validate(uuidValidation), getDimensionById);
dimensionRouter.get("/", getAllDimensions);

export default dimensionRouter;