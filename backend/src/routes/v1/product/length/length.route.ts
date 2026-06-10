import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createLength, updateLength, getLengths, getLengthById, deleteLength } from "../../../../controller/v1/product/length.controller.js";
import { createLengthValidation, updateLengthValidation } from "../../../../validations/product/length.validation.js";

const lengthRouter = Router();

lengthRouter.post("/addLength", validate(createLengthValidation), createLength);
lengthRouter.put("/updateLength/:id", validate(updateLengthValidation), updateLength);
lengthRouter.delete("/deleteLength/:id", validate(uuidValidation), deleteLength);
lengthRouter.get("/getLength/:id", validate(uuidValidation), getLengthById);
lengthRouter.get("/getAllLengths", getLengths);

export default lengthRouter;