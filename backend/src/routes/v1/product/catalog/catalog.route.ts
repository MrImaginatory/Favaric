import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createCatalog, getAllCatalogs, getCatalogById, updateCatalog, deleteCatalog, searchCatalog } from "../../../../controller/v1/product/catalog.controller.js";
import { createCatalogValidation, updateCatalogValidation, searchCatalogValidation } from "../../../../validations/product/catalog.validation.js";
import upload from "../../../../middleware/multer.middleware.js";
import { searchLimiter } from "../../../../middleware/rateLimiter.middleware.js";
const catalogRouter = Router();

const handleCatalogFiles = (req: any, _res: any, next: any) => {
    if (req.files) {
        if (req.files['catalogImage'] && req.files['catalogImage'].length > 0) {
            req.body.catalogImage = req.files['catalogImage'][0].path.replace(/\\/g, '/');
        }
        if (req.files['subimages'] && req.files['subimages'].length > 0) {
            req.body.catalogSubImages = req.files['subimages'].map((f: any) => f.path.replace(/\\/g, '/'));
        }
    }
    next();
};

catalogRouter.post(
    "/addCatalog",
    upload("catalog").fields([{ name: "catalogImage", maxCount: 1 }, { name: "subimages", maxCount: 20 }]),
    handleCatalogFiles,
    validate(createCatalogValidation),
    createCatalog
);

catalogRouter.get("/getCatalogs", getAllCatalogs);

catalogRouter.get("/getCatalog/:id", validate(uuidValidation), getCatalogById);

catalogRouter.patch(
    "/updateCatalog/:id",
    upload("catalog").fields([{ name: "catalogImage", maxCount: 1 }, { name: "subimages", maxCount: 20 }]),
    handleCatalogFiles,
    validate(updateCatalogValidation),
    updateCatalog
);

catalogRouter.delete("/deleteCatalog/:id", validate(uuidValidation), deleteCatalog);

catalogRouter.get("/searchCatalog", searchLimiter, validate(searchCatalogValidation), searchCatalog);

export default catalogRouter;
