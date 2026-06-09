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

countryOriginRouter.post("/addCountry", validate(createCountryOriginValidation), createCountryOrigin);
countryOriginRouter.put("/updateCountry/:id", validate(updateCountryOriginValidation), updateCountryOrigin);
countryOriginRouter.delete("/deleteCountry/:id", validate(uuidValidation), deleteCountryOrigin);
countryOriginRouter.get("/getCountryById/:id", validate(uuidValidation), getCountryOriginById);
countryOriginRouter.get("/getCountries", getCountryOrigins);

export default countryOriginRouter;