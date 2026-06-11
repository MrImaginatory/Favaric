import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } from "../../../../controller/v1/product/category.controller.js";
import { createCategoryValidation, updateCategoryValidation } from "../../../../validations/product/category.validation.js";
import upload from "../../../../middleware/multer.middleware.js";

const categoryRouter = Router();

const handleCategoryFiles = (req: any, _res: any, next: any) => {
    if (req.file) {
        req.body.categoryImage = req.file.path.replace(/\\/g, '/');
    }
    next();
};

categoryRouter.post(
    "/addCategory",
    upload("category").single("categoryImage"),
    handleCategoryFiles,
    validate(createCategoryValidation),
    createCategory
);

categoryRouter.get("/getCategories", getAllCategories);

categoryRouter.get("/getCategory/:id", validate(uuidValidation), getCategoryById);

categoryRouter.patch(
    "/updateCategory/:id",
    upload("category").single("categoryImage"),
    handleCategoryFiles,
    validate(updateCategoryValidation),
    updateCategory
);

categoryRouter.delete("/deleteCategory/:id", validate(uuidValidation), deleteCategory);

export default categoryRouter;
