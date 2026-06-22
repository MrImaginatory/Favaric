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
    deleteCountryOrigin,
    searchCountries
} from "../../../../controller/v1/product/countryOfOrigin.controller.js";


const countryOriginRouter = Router();

countryOriginRouter.post("/addCountry", validate(createCountryOriginValidation), createCountryOrigin);
countryOriginRouter.patch("/updateCountry/:id", validate(updateCountryOriginValidation), updateCountryOrigin);
countryOriginRouter.delete("/deleteCountry/:id", validate(uuidValidation), deleteCountryOrigin);
countryOriginRouter.get("/getCountryById/:id", validate(uuidValidation), getCountryOriginById);
countryOriginRouter.get("/getCountries", getCountryOrigins);
countryOriginRouter.get("/searchCountries", searchCountries)

export default countryOriginRouter;