import { createClient } from "redis";
import config from "../configs/constant.config.js";
import logger from "./logger.util.js";

const redis = createClient({
    socket: {
        host: config.REDIS.HOST,
        port: Number(config.REDIS.PORT),
    },
    ...(config.REDIS.PASSWORD ? { password: config.REDIS.PASSWORD } : {}),
});

redis.on("connect", () => {
    logger.log("✅ Connected to Redis successfully");
});

redis.on("error", (err: any) => {
    logger.error(`❌ Redis connection error: ${err}`);
});

redis.connect().catch((err: any) => logger.error(`Redis connect error: ${err}`));

export default redis;
