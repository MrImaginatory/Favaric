import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import { createShippingCharge, updateShippingCharge, getAllShippingCharges, getShippingChargeById, deleteShippingCharge } from "../../../../controller/v1/product/shippingCharge.controller.js"
import { createShippingChargeValidation, updateShippingChargeValidation } from "../../../../validations/product/shippingCharge.validation.js"

const shippingChargeRouter = Router();

shippingChargeRouter.post("/addShippingCharge", validate(createShippingChargeValidation), createShippingCharge);
shippingChargeRouter.put("/updateShippingCharge/:id", validate(updateShippingChargeValidation), updateShippingCharge);
shippingChargeRouter.get("/getShippingCharge/:id", validate(uuidValidation), getShippingChargeById);
shippingChargeRouter.get("/getAllShippingCharges", getAllShippingCharges);
shippingChargeRouter.delete("/deleteShippingCharge/:id", validate(uuidValidation), deleteShippingCharge);

export default shippingChargeRouter;
