import redis from "../utils/redis.util.js";
import logger from "../utils/logger.util.js";

const DEFAULT_TTL = 60;
const SESSION_COUNT_KEY = "active_sessions_count";

export const getCache = async <T>(key: string): Promise<T | null> => {
    try {
        const data = await redis.get(key);
        if (!data) return null;
        return JSON.parse(data) as T;
    } catch (error) {
        logger.error(`Cache get error for key ${key}: ${error}`);
        return null;
    }
};

export const setCache = async (key: string, data: any, ttl: number = DEFAULT_TTL): Promise<void> => {
    try {
        await redis.set(key, JSON.stringify(data), { EX: ttl });
    } catch (error) {
        logger.error(`Cache set error for key ${key}: ${error}`);
    }
};

export const deleteCacheByPattern = async (pattern: string): Promise<void> => {
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(keys);
        }
    } catch (error) {
        logger.error(`Cache delete error for pattern ${pattern}: ${error}`);
    }
};

export const deleteCache = async (...keys: string[]): Promise<void> => {
    try {
        if (keys.length > 0) {
            await redis.del(keys);
        }
    } catch (error) {
        logger.error(`Cache delete error: ${error}`);
    }
};

export const incrementSessionCount = async (): Promise<number> => {
    try {
        return await redis.incr(SESSION_COUNT_KEY);
    } catch (error) {
        logger.error(`Session count increment error: ${error}`);
        return 0;
    }
};

export const decrementSessionCount = async (): Promise<number> => {
    try {
        const count = await redis.decr(SESSION_COUNT_KEY);
        if (count < 0) await redis.set(SESSION_COUNT_KEY, "0");
        return Math.max(0, count);
    } catch (error) {
        logger.error(`Session count decrement error: ${error}`);
        return 0;
    }
};

export const getSessionCount = async (): Promise<number> => {
    try {
        const count = await redis.get(SESSION_COUNT_KEY);
        return count ? parseInt(count, 10) : 0;
    } catch (error) {
        logger.error(`Session count get error: ${error}`);
        return 0;
    }
};
