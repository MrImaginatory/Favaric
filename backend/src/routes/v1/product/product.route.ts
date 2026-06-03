import { Router } from "express";

import colorRouter from "./color/color.route.js";

const productRouter = Router();

productRouter.use("/colors", colorRouter);

export default productRouter;
