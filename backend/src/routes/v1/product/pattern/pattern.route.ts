import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createPattern, updatePattern, getPatterns, getPatternById, deletePattern } from "../../../../controller/v1/product/pattern.controller.js";
import { createPatternValidation, updatePatternValidation } from "../../../../validations/product/pattern.validation.js";

const patternRouter = Router();

patternRouter.post("/", validate(createPatternValidation), createPattern);
patternRouter.put("/:id", validate(updatePatternValidation), updatePattern);
patternRouter.delete("/:id", validate(uuidValidation), deletePattern);
patternRouter.get("/:id", validate(uuidValidation), getPatternById);
patternRouter.get("/", getPatterns);

export default patternRouter;