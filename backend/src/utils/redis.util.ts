import { Redis } from "ioredis";
import config from "../configs/constant.config.js";
import logger from "./logger.util.js";

const redis = new Redis({
    host: config.REDIS.HOST,
    port: Number(config.REDIS.PORT),
    password: config.REDIS.PASSWORD || undefined,
});

redis.on("connect", () => {
    logger.log("✅ Connected to Redis successfully");
});

redis.on("error", (err: any) => {
    logger.error(`❌ Redis connection error: ${err}`);
});

export default redis;
