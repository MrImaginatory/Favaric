import { Router } from "express";
import { protect } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import wishlistController from "../../../controller/v1/user/wishlist.controller.js";
import { addToWishlistSchema } from "../../../validations/user/wishlist.validation.js";

const wishlistRouter = Router();

wishlistRouter.post("/", protect, validate(addToWishlistSchema), wishlistController.addToWishlist);
wishlistRouter.get("/", protect, wishlistController.getWishlist);
wishlistRouter.delete("/:wishlistId", protect, wishlistController.deleteWishlistItem);

export default wishlistRouter;