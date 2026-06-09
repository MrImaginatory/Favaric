import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createWeight, updateWeight, getAllWeights, getWeightById, deleteWeight } from "../../../../controller/v1/product/weight.controller.js";
import { createWeightValidation, updateWeightValidation } from "../../../../validations/product/weight.validation.js";

const weightRouter = Router();

weightRouter.post("/", validate(createWeightValidation), createWeight);
weightRouter.put("/:id", validate(updateWeightValidation), updateWeight);
weightRouter.get("/", getAllWeights);
weightRouter.get("/:id", validate(uuidValidation), getWeightById);
weightRouter.delete("/:id", validate(uuidValidation), deleteWeight);

export default weightRouter;