import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createBrand, getBrands, getBrandById, updateBrand, deleteBrand } from "../../../../controller/v1/product/brand.controller.js";
import { createBrandValidation, updateBrandValidation } from "../../../../validations/product/brand.validation.js";

const brandRouter = Router();

brandRouter.post("/addBrand", validate(createBrandValidation), createBrand);
brandRouter.get("/getBrands", getBrands);
brandRouter.get("/getBrand/:id", validate(uuidValidation), getBrandById);
brandRouter.patch("/updateBrand/:id", validate(updateBrandValidation), updateBrand);
brandRouter.delete("/deleteBrand/:id", validate(uuidValidation), deleteBrand);

export default brandRouter;