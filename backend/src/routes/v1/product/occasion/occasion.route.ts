import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createOccasion, updateOccasion, getOccasions, getOccasionById, deleteOccasion } from "../../../../controller/v1/product/occasion.controller.js";
import { createOccasionValidation, updateOccasionValidation } from "../../../../validations/product/occasion.validation.js";

const occasionRouter = Router();

occasionRouter.post("/addOccasion", validate(createOccasionValidation), createOccasion);
occasionRouter.put("/updateOccasion/:id", validate(updateOccasionValidation), updateOccasion);
occasionRouter.delete("/deleteOccasion/:id", validate(uuidValidation), deleteOccasion);
occasionRouter.get("/getOccasion/:id", validate(uuidValidation), getOccasionById);
occasionRouter.get("/getAllOccasions", getOccasions);

export default occasionRouter;