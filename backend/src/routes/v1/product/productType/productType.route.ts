import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createProductType, updateProductType, getAllProductTypes, getProductTypeById, deleteProductType } from "../../../../controller/v1/product/productType.controller.js"
import { createProductTypeValidation, updateProductTypeValidation } from "../../../../validations/product/productType.validation.js"

const productTypeRouter = Router();

productTypeRouter.post("/addProductType", validate(createProductTypeValidation), createProductType);
productTypeRouter.put("/updateProductType/:id", validate(updateProductTypeValidation), updateProductType);
productTypeRouter.get("/getProductType/:id", validate(uuidValidation), getProductTypeById);
productTypeRouter.get("/getAllProductTypes", getAllProductTypes);
productTypeRouter.delete("/deleteProductType/:id", validate(uuidValidation), deleteProductType);

export default productTypeRouter;