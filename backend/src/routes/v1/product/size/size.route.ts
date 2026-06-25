import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createSize, updateSize, getAllSizes, getSizeById, deleteSize, searchSize } from "../../../../controller/v1/product/size.controller.js";
import { createSizeValidation, updateSizeValidation, searchSizeValidation } from "../../../../validations/product/size.validation.js";

const sizeRouter = Router();

sizeRouter.post("/addSize", validate(createSizeValidation), createSize);
sizeRouter.patch("/updateSize/:id", validate(updateSizeValidation), updateSize);
sizeRouter.get("/getSize/:id", validate(uuidValidation), getSizeById);
sizeRouter.get("/getAllSizes", getAllSizes);
sizeRouter.delete("/deleteSize/:id", validate(uuidValidation), deleteSize);
sizeRouter.get("/searchSize", validate(searchSizeValidation), searchSize)

export default sizeRouter;