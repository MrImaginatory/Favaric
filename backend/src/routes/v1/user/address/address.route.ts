import { Router } from "express";
import { protect } from "../../../../middleware/auth.middleware.js";
import { validate } from "../../../../middleware/validate.middleware.js";
import addressController from "../../../../controller/v1/user/address.controller.js";
import { addAddressSchema, editAddressSchema } from "../../../../validations/user/address.validation.js";


const addressRouter = Router();

addressRouter.post("/addAddress", protect, validate(addAddressSchema), addressController.addAddress);
addressRouter.patch("/updateAddress/:id", protect, validate(editAddressSchema), addressController.updateAddress);
addressRouter.delete("/deleteAddress/:id", protect, addressController.deleteAddress);
addressRouter.get("/getAddresses", protect, addressController.getAddresses);
addressRouter.get("/getAddress/:id", protect, addressController.getAddressById);
addressRouter.put("/toggleDefaultAddress/:id", protect, addressController.toggleDefaultAddress);

export default addressRouter;