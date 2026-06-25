import { Router } from "express";
import countryCodeController from "../../../controller/v1/application/countryCode.controller.js";

const countryCodeRouter = Router();

countryCodeRouter.get("/getCountryCodes", countryCodeController.getAllCountryCodes);

export default countryCodeRouter;
