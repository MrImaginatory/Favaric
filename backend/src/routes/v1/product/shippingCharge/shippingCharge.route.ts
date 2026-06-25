import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createShippingCharge, updateShippingCharge, getAllShippingCharges, getShippingChargeById, deleteShippingCharge, searchShippingCharge } from "../../../../controller/v1/product/shippingCharge.controller.js"
import { createShippingChargeValidation, updateShippingChargeValidation, searchShippingChargeValidation } from "../../../../validations/product/shippingCharge.validation.js"

const shippingChargeRouter = Router();

shippingChargeRouter.post("/addShippingCharge", validate(createShippingChargeValidation), createShippingCharge);
shippingChargeRouter.patch("/updateShippingCharge/:id", validate(updateShippingChargeValidation), updateShippingCharge);
shippingChargeRouter.get("/getShippingCharge/:id", validate(uuidValidation), getShippingChargeById);
shippingChargeRouter.get("/getAllShippingCharges", getAllShippingCharges);
shippingChargeRouter.delete("/deleteShippingCharge/:id", validate(uuidValidation), deleteShippingCharge);
shippingChargeRouter.get("/searchShippingCharge", validate(searchShippingChargeValidation), searchShippingCharge)

export default shippingChargeRouter;
