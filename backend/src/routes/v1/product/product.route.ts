import { Router } from "express";

import protect from "../../../middleware/auth.middleware.js";

import colorRouter from "./color/color.route.js";
import brandRouter from "./brand/brand.route.js"

const productRouter = Router();

productRouter.use(protect);

productRouter.use("/colors", colorRouter);
productRouter.use("/brands", brandRouter);

export default productRouter;
