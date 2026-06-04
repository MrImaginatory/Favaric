import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { uuidValidation } from "../../../../validations/uuid.validation.js";
import {
    createCountryOriginValidation, updateCountryOriginValidation
} from "../../../../validations/product/countryOfOrigin.validation.js";
import {
    createCountryOrigin,
    updateCountryOrigin,
    getCountryOrigins,
    getCountryOriginById,
    deleteCountryOrigin
} from "../../../../controller/v1/product/countryOfOrigin.controller.js";


const countryOriginRouter = Router();

countryOriginRouter.post("/", validate(createCountryOriginValidation), createCountryOrigin);
countryOriginRouter.put("/:id", validate(updateCountryOriginValidation), updateCountryOrigin);
countryOriginRouter.delete("/:id", validate(uuidValidation), deleteCountryOrigin);
countryOriginRouter.get("/:id", validate(uuidValidation), getCountryOriginById);
countryOriginRouter.get("/", getCountryOrigins);

export default countryOriginRouter;