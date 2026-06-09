import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createSize, updateSize, getAllSizes, getSizeById, deleteSize } from "../../../../controller/v1/product/size.controller.js";
import { createSizeValidation, updateSizeValidation } from "../../../../validations/product/size.validation.js";

const sizeRouter = Router();

sizeRouter.post("/", validate(createSizeValidation), createSize);
sizeRouter.put("/:id", validate(updateSizeValidation), updateSize);
sizeRouter.get("/", getAllSizes);
sizeRouter.get("/:id", validate(uuidValidation), getSizeById);
sizeRouter.delete("/:id", validate(uuidValidation), deleteSize);

export default sizeRouter;