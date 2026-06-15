import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import productController from "../../../../controller/v1/product/product.controller.js";
import upload from "../../../../middleware/multer.middleware.js";

const productEntityRouter = Router();

const handleProductFiles = (req: any, _res: any, next: any) => {
    if (req.files) {
        if (req.files['thumbnailImage'] && req.files['thumbnailImage'].length > 0) {
            req.body.thumbnailImage = req.files['thumbnailImage'][0].path.replace(/\\/g, '/');
        }
        if (req.files['image'] && req.files['image'].length > 0) {
            req.body.image = req.files['image'][0].path.replace(/\\/g, '/');
        }
        if (req.files['subImages'] && req.files['subImages'].length > 0) {
            req.body.subImages = req.files['subImages'].map((f: any) => f.path.replace(/\\/g, '/'));
        }
    }
    next();
};

productEntityRouter.post(
    "/addProduct",
    upload("product").fields([{ name: "thumbnailImage", maxCount: 1 }, { name: "image", maxCount: 1 }, { name: "subImages", maxCount: 10 }]),
    handleProductFiles,
    productController.addProduct
);

productEntityRouter.get("/getProducts", productController.getAllProducts);

productEntityRouter.get("/getProduct/:id", validate(uuidValidation), productController.getProductById);

productEntityRouter.patch(
    "/updateProduct/:id",
    validate(uuidValidation),
    upload("product").fields([{ name: "thumbnailImage", maxCount: 1 }, { name: "image", maxCount: 1 }, { name: "subImages", maxCount: 10 }]),
    handleProductFiles,
    productController.updateProduct
);

productEntityRouter.delete("/deleteProduct/:id", validate(uuidValidation), productController.deleteProduct);

export default productEntityRouter;
