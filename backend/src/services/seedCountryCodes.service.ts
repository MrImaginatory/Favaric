import CountryCode from "../models/application/countryCode.model.js";
import countryCodes from "../data/CountryCode.json" with { type: "json" };
import logger from "../utils/logger.util.js";

export const seedCountryCodes = async (): Promise<void> => {
    const count = await CountryCode.count();
    if (count > 0) {
        logger.log(`Country codes already seeded (${count} records). Skipping.`);
        return;
    }

    const data = countryCodes
        .filter((c: any) => c.countryName && c.callingCode && c.isoCode)
        .map((c: any) => ({
            countryName: c.countryName,
            callingCode: c.callingCode,
            isoCode: c.isoCode,
        }));

    await CountryCode.bulkCreate(data);
    logger.success(`Seeded ${data.length} country codes.`);
};
