import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createSubCategory, getAllSubCategories, getSubCategoryById, updateSubCategory, deleteSubCategory, searchSubCategory } from "../../../../controller/v1/product/subcategory.controller.js";
import { createSubCategoryValidation, updateSubCategoryValidation } from "../../../../validations/product/subcategory.validation.js";
import upload from "../../../../middleware/multer.middleware.js";

const subcategoryRouter = Router();

const handleSubCategoryFiles = (req: any, _res: any, next: any) => {
    if (req.file) {
        req.body.subcategoryImage = req.file.path.replace(/\\/g, '/');
    }
    next();
};

subcategoryRouter.post(
    "/addSubCategory",
    upload("subcategory", "subcategoryName").single("subcategoryImage"),
    handleSubCategoryFiles,
    validate(createSubCategoryValidation),
    createSubCategory
);

subcategoryRouter.get("/getSubCategories", getAllSubCategories);

subcategoryRouter.get("/getSubCategory/:id", validate(uuidValidation), getSubCategoryById);

subcategoryRouter.patch(
    "/updateSubCategory/:id",
    upload("subcategory", "subcategoryName").single("subcategoryImage"),
    handleSubCategoryFiles,
    validate(updateSubCategoryValidation),
    updateSubCategory
);

subcategoryRouter.delete("/deleteSubCategory/:id", validate(uuidValidation), deleteSubCategory);

subcategoryRouter.get("/searchSubCategory", searchSubCategory)

export default subcategoryRouter;
