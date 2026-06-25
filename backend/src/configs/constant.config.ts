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
        DB_HOST: getEnv("DB_HOST", true),
        DB_PORT: getEnv("DB_PORT", true),
        DB_USER: getEnv("DB_USER", true),
        DB_PASSWORD: getEnv("DB_PASSWORD", true),
        DB_NAME: getEnv("DB_NAME", true),

        POOL: {
            MAX: getEnv("DB_POOL_MAX", true),
            MIN: getEnv("DB_POOL_MIN", true),
            ACQUIRE: getEnv("DB_POOL_ACQUIRE", true),
            IDLE: getEnv("DB_POOL_IDLE", true),
        },
        RETRY: {
            MAX: getEnv("DB_MAX_RETRY", true),
        },

        FORCE_DROP_TABLE: getEnv("FORCE_DROP_TABLE", true),
        FORCE_ALTER_TABLE: getEnv("FORCE_ALTER_TABLE", true)
    },

    WEBSITE_URL: getEnv("WEBSITE_URL", true),
    WEBSITE_NAME: getEnv("WEBSITE_NAME", true),

    NODE_ENV: getEnv("NODE_ENV", true),

    UPLOADS_PATH: getEnv("UPLOADS_PATH", true),

    JWT: {
        SECRET: getEnv("JWT_SECRET", true),
        TOKEN_EXPIRY: getEnv("JWT_TOKEN_EXPIRY", true),
        REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET", true),
        REFRESH_EXPIRY: getEnv("JWT_REFRESH_EXPIRY", true)
    },
    REDIS: {
        HOST: getEnv("REDIS_HOST", true),
        PORT: getEnv("REDIS_PORT", true),
        PASSWORD: getEnv("REDIS_PASSWORD", false),
    },
    SESSION: {
        SECRET: getEnv("SESSION_SECRET", true),
    },
    SMTP: {
        HOST: getEnv("SMTP_HOST", true),
        PORT: getEnv("SMTP_PORT", true),
        USER: getEnv("SMTP_USER", true),
        PASS: getEnv("SMTP_PASS", true),
        FROM: getEnv("SMTP_FROM", true),
    },
    SECURITY: {
        SQLITE_ENCRYPTION_KEY: getEnv("SQLITE_ENCRYPTION_KEY", true),
    },
    RATE_LIMIT: {
        GLOBAL_RPM: getEnv("RATE_LIMIT_GLOBAL_RPM", true),
        AUTH_RPM: getEnv("RATE_LIMIT_AUTH_RPM", true),
        SEARCH_RPM: getEnv("RATE_LIMIT_SEARCH_RPM", true),
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

