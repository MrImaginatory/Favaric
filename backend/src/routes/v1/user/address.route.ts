import { Router } from "express";
import { protect } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import addressController from "../../../controller/v1/user/address.controller.js";
import { addAddressSchema, editAddressSchema } from "../../../validations/user/address.validation.js";


const addressRouter = Router();

addressRouter.post("/", protect, validate(addAddressSchema), addressController.addAddress);
addressRouter.put("/:addressId", protect, validate(editAddressSchema), addressController.updateAddress);
addressRouter.delete("/:addressId", protect, addressController.deleteAddress);
addressRouter.get("/", protect, addressController.getAddresses);
addressRouter.put("/:addressId/toggle-default", protect, addressController.toggleDefaultAddress);

export default addressRouter;