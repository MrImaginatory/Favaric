import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createWeight, updateWeight, getAllWeights, getWeightById, deleteWeight, searchWeight } from "../../../../controller/v1/product/weight.controller.js";
import { createWeightValidation, updateWeightValidation, searchWeightValidation } from "../../../../validations/product/weight.validation.js";

const weightRouter = Router();

weightRouter.post("/addWeight", validate(createWeightValidation), createWeight);
weightRouter.put("/updateWeight/:id", validate(updateWeightValidation), updateWeight);
weightRouter.get("/getWeight/:id", validate(uuidValidation), getWeightById);
weightRouter.get("/getAllWeights", getAllWeights);
weightRouter.delete("/deleteWeight/:id", validate(uuidValidation), deleteWeight);
weightRouter.get("/searchWeight", validate(searchWeightValidation), searchWeight)

export default weightRouter;