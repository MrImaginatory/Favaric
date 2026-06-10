import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createDimension, updateDimension, getAllDimensions, getDimensionById, deleteDimension } from "../../../../controller/v1/product/dimension.controller.js";
import { createDimensionValidation, updateDimensionValidation } from "../../../../validations/product/dimension.validation.js";

const dimensionRouter = Router();

dimensionRouter.post("/addDimension", validate(createDimensionValidation), createDimension);
dimensionRouter.put("/updateDimension/:id", validate(updateDimensionValidation), updateDimension);
dimensionRouter.delete("/deleteDimension/:id", validate(uuidValidation), deleteDimension);
dimensionRouter.get("/getDimension/:id", validate(uuidValidation), getDimensionById);
dimensionRouter.get("/getAllDimensions", getAllDimensions);

export default dimensionRouter;