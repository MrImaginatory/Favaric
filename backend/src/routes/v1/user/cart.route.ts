import { Router } from "express";
import { protect } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import cartController from "../../../controller/v1/user/cart.controller.js";
import { addToCartSchema } from "../../../validations/user/cart.validation.js";

const cartRouter = Router();

cartRouter.post("/", protect, validate(addToCartSchema), cartController.addToCart);
cartRouter.put("/:cartItemId", protect, validate(addToCartSchema), cartController.updateCart);
cartRouter.delete("/:cartItemId", protect, cartController.deleteCart);
cartRouter.get("/", protect, cartController.getCart);

export default cartRouter;