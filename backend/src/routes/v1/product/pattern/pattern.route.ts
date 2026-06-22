import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createPattern, updatePattern, getPatterns, getPatternById, deletePattern, searchPattern } from "../../../../controller/v1/product/pattern.controller.js";
import { createPatternValidation, updatePatternValidation } from "../../../../validations/product/pattern.validation.js";

const patternRouter = Router();

patternRouter.post("/addPattern", validate(createPatternValidation), createPattern);
patternRouter.patch("/updatePattern/:id", validate(updatePatternValidation), updatePattern);
patternRouter.delete("/deletePattern/:id", validate(uuidValidation), deletePattern);
patternRouter.get("/getPattern/:id", validate(uuidValidation), getPatternById);
patternRouter.get("/getAllPatterns", getPatterns);
patternRouter.get("/searchPattern", searchPattern)

export default patternRouter;