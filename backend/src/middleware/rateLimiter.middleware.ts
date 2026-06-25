import rateLimit from "express-rate-limit";
import config from "../configs/constant.config.js";

const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: Number(config.RATE_LIMIT.GLOBAL_RPM),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: "Too many requests. Please try again later.",
    },
});

const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: Number(config.RATE_LIMIT.AUTH_RPM),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: "Too many auth attempts. Please try again later.",
    },
});

const searchLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: Number(config.RATE_LIMIT.SEARCH_RPM),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: "Too many search requests. Please try again later.",
    },
});

export { globalLimiter, authLimiter, searchLimiter };
