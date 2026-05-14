import dotenv from "dotenv";
import logger from "../utils/logger.util.js";

dotenv.config();

const missingKeys: string[] = [];

const getEnv = (key: string, required: boolean = true): string => {
    const value = process.env[key];
    if (required && (value === undefined || value === null || value === "")) {
        missingKeys.push(key);
    }
    return value || "";
}

const config = {
    PORT: getEnv("PORT", true),

    DB: {
        DBHOST: getEnv("DBHOST", true),
        DBPORT: getEnv("DBPORT", true),
        DBUSER: getEnv("DBUSER", true),
        DBPASSWORD: getEnv("DBPASSWORD", true),
        DBNAME: getEnv("DBNAME", true),

        FORCE_DROP_TABLE: getEnv("FORCE_DROP_TABLE", true),
        FORCE_ALTER_TABLE: getEnv("FORCE_ALTER_TABLE", true)
    },

    WEBSITE_URL: getEnv("WEBSITE_URL", true),

    NODE_ENV: getEnv("NODE_ENV", true),

    UPLOADS_PATH: getEnv("UPLOADS_PATH", true),

    JWT: {
        SECRET: getEnv("JWT_SECRET", true),
        REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET", true),
    }
}

if (missingKeys.length > 0) {
    logger.error("❌ Missing Environment Variables in .env file:");
    missingKeys.forEach(key => {
        logger.error(`  - [${key}] is required but missing or empty`);
    });
    logger.log("Exiting the Process");
    process.exit(1);
}

export default config;

