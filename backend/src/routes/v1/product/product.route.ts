import { Router } from "express";

import protect from "../../../middleware/auth.middleware.js";

import brandRouter from "./brand/brand.route.js"
import colorRouter from "./color/color.route.js";
import countryOriginRouter from "./countryOfOrigin/countryOrigin.route.js";
import dimensionRouter from "./dimension/dimension.route.js";
import fabricRouter from "./fabric/fabric.route.js";
import lengthRouter from "./length/length.route.js";
import occasionRouter from "./occasion/occasion.route.js";
import patternRouter from "./pattern/pattern.route.js";
import productTypeRouter from "./productType/productType.route.js";
import shippingChargeRouter from "./shippingCharge/shippingCharge.route.js";
import sizeRouter from "./size/size.route.js";
import weightRouter from "./weight/weight.route.js";

const productRouter = Router();

productRouter.use(protect);

productRouter.use("/colors", colorRouter);
productRouter.use("/brands", brandRouter);
productRouter.use("/countries", countryOriginRouter);
productRouter.use("/dimensions", dimensionRouter);
productRouter.use("/fabrics", fabricRouter);
productRouter.use("/lengths", lengthRouter);
productRouter.use("/occasions", occasionRouter);
productRouter.use("/patterns", patternRouter);
productRouter.use("/product-types", productTypeRouter);
productRouter.use("/shipping-charges", shippingChargeRouter);
productRouter.use("/sizes", sizeRouter);
productRouter.use("/weights", weightRouter);

export default productRouter;
