import type { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler.util.js";
import sendResponse from "../../../utils/responseHandler.util.js";
import StatusMessages from "../../../configs/message.config.js";
import CountryCode from "../../../models/application/countryCode.model.js";
import { getCache, setCache } from "../../../services/cache.service.js";

const getAllCountryCodes = asyncHandler(async (_req: Request, res: Response) => {
    const cacheKey = "countryCodes:all";

    const cached = await getCache<any>(cacheKey);
    if (cached) {
        sendResponse(res, 200, StatusMessages.SUCCESS, cached);
        return;
    }

    const codes = await CountryCode.findAll({ order: [["countryName", "ASC"]] });
    await setCache(cacheKey, codes, 600);

    sendResponse(res, 200, StatusMessages.SUCCESS, codes);
});

export default { getAllCountryCodes };
