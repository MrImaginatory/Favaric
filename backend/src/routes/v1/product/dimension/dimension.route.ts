import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createDimension, updateDimension, getAllDimensions, getDimensionById, deleteDimension } from "../../../../controller/v1/product/dimension.controller.js";
import { createDimensionValidation, updateDimensionValidation } from "../../../../validations/product/dimension.validation.js";

const dimensionRouter = Router();

dimensionRouter.post("/create-dimension", validate(createDimensionValidation), createDimension);
dimensionRouter.put("/update-dimension/:id", validate(updateDimensionValidation), updateDimension);
dimensionRouter.delete("/delete-dimension/:id", validate(uuidValidation), deleteDimension);
dimensionRouter.get("/get-dimension/:id", validate(uuidValidation), getDimensionById);
dimensionRouter.get("/get-all-dimensions", getAllDimensions);

export default dimensionRouter;