import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createLength, updateLength, getLengths, getLengthById, deleteLength } from "../../../../controller/v1/product/length.controller.js";
import { createLengthValidation, updateLengthValidation } from "../../../../validations/product/length.validation.js";

const lengthRouter = Router();

lengthRouter.post("/", validate(createLengthValidation), createLength);
lengthRouter.put("/:id", validate(updateLengthValidation), updateLength);
lengthRouter.delete("/:id", validate(uuidValidation), deleteLength);
lengthRouter.get("/:id", validate(uuidValidation), getLengthById);
lengthRouter.get("/", getLengths);

export default lengthRouter;