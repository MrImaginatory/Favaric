import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createBrand, getBrands, getBrandById, updateBrand, deleteBrand, searchBrands } from "../../../../controller/v1/product/brand.controller.js";
import { createBrandValidation, updateBrandValidation, searchBrandValidation } from "../../../../validations/product/brand.validation.js";
import upload from "../../../../middleware/multer.middleware.js";

const brandRouter = Router();

brandRouter.post("/addBrand", upload("brands", "brandName").single("brandLogo"), validate(createBrandValidation), createBrand);
brandRouter.get("/getBrands", getBrands);
brandRouter.get("/getBrand/:id", validate(uuidValidation), getBrandById);
brandRouter.patch("/updateBrand/:id", upload("brands", "brandName").single("brandLogo"), validate(updateBrandValidation), updateBrand);
brandRouter.delete("/deleteBrand/:id", validate(uuidValidation), deleteBrand);
brandRouter.get("/searchBrand", validate(searchBrandValidation), searchBrands);

export default brandRouter;