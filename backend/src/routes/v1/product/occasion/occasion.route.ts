import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createOccasion, updateOccasion, getOccasions, getOccasionById, deleteOccasion } from "../../../../controller/v1/product/occasion.controller.js";
import { createOccasionValidation, updateOccasionValidation } from "../../../../validations/product/occasion.validation.js";

const occasionRouter = Router();

occasionRouter.post("/", validate(createOccasionValidation), createOccasion);
occasionRouter.put("/:id", validate(updateOccasionValidation), updateOccasion);
occasionRouter.delete("/:id", validate(uuidValidation), deleteOccasion);
occasionRouter.get("/:id", validate(uuidValidation), getOccasionById);
occasionRouter.get("/", getOccasions);

export default occasionRouter;