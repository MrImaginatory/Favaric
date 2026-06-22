import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createFabric, updateFabric, getAllFabrics, getFabricById, deleteFabric, searchFabric } from "../../../../controller/v1/product/fabric.controller.js";
import { createFabricValidation, updateFabricValidation } from "../../../../validations/product/fabric.validation.js";

const fabricRouter = Router();

fabricRouter.post("/addFabric", validate(createFabricValidation), createFabric);
fabricRouter.patch("/updateFabric/:id", validate(updateFabricValidation), updateFabric);
fabricRouter.delete("/deleteFabric/:id", validate(uuidValidation), deleteFabric);
fabricRouter.get("/getFabric/:id", validate(uuidValidation), getFabricById);
fabricRouter.get("/getAllFabrics", getAllFabrics);
fabricRouter.get("/searchFabric", searchFabric)

export default fabricRouter;