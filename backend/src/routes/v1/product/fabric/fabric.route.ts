import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createFabric, updateFabric, getAllFabrics, getFabricById, deleteFabric } from "../../../../controller/v1/product/fabric.controller.js";
import { createFabricValidation, updateFabricValidation } from "../../../../validations/product/fabric.validation.js";

const fabricRouter = Router();

fabricRouter.post("/", validate(createFabricValidation), createFabric);
fabricRouter.put("/:id", validate(updateFabricValidation), updateFabric);
fabricRouter.delete("/:id", validate(uuidValidation), deleteFabric);
fabricRouter.get("/:id", validate(uuidValidation), getFabricById);
fabricRouter.get("/", getAllFabrics);

export default fabricRouter;