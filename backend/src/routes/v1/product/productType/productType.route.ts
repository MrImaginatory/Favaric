import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createProductType, updateProductType, getAllProductTypes, getProductTypeById, deleteProductType } from "../../../../controller/v1/product/productType.controller.js"
import { createProductTypeValidation, updateProductTypeValidation } from "../../../../validations/product/productType.validation.js"

const productTypeRouter = Router();

productTypeRouter.post("/", validate(createProductTypeValidation), createProductType);
productTypeRouter.put("/:id", validate(updateProductTypeValidation), updateProductType);
productTypeRouter.get("/", getAllProductTypes);
productTypeRouter.get("/:id", validate(uuidValidation), getProductTypeById);
productTypeRouter.delete("/:id", validate(uuidValidation), deleteProductType);

export default productTypeRouter;