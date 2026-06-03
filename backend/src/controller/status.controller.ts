import type { Request, Response } from "express";
import sequelize from "../database/database.js";
import redis from "../utils/redis.util.js";
import path from "path";

export const getStatusData = async () => {

    // 2. Check Database Connection
    let dbStatus = "operational";
    try {
        await sequelize.authenticate();
    } catch (err: any) {
        dbStatus = "disrupted";
    }

    // 3. Check Redis Connection
    let redisStatus = "operational";
    try {
        // Fast ping to verify Redis is actually responding
        const pingPromise = redis.ping();
        const timeoutPromise = new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error("Redis ping timeout")), 2000)
        );
        const pingResult = await Promise.race([pingPromise, timeoutPromise]);
        
        if (pingResult !== "PONG" && !redis.isReady) {
            redisStatus = "disrupted";
        }
    } catch (err: any) {
        redisStatus = "disrupted";
    }

    // 4. Compute Overall Status
    const overallStatus = (dbStatus === "operational" && redisStatus === "operational") 
        ? "operational" 
        : "disrupted";

    return {
        status: overallStatus,
        checkedAt: new Date().toLocaleString(),
        services: {
            api: {
                name: "API Server",
                status: "operational"
            },
            database: {
                name: "Database",
                status: dbStatus
            },
            cache: {
                name: "Cache Store",
                status: redisStatus
            }
        }
    };
};

/**
 * Controller to serve the HTML Status Dashboard
 */
export const showStatusPage = async (_req: Request, res: Response) => {
    try {
        const filePath = path.join(process.cwd(), "public", "status.html");
        return res.sendFile(filePath);
    } catch (err: any) {
        return res.status(500).send(`<h1>Internal Server Error</h1><p>${err.message}</p>`);
    }
};

/**
 * Controller to serve the JSON endpoint
 */
export const showStatusJson = async (_req: Request, res: Response) => {
    try {
        const data = await getStatusData();
        const statusCode = data.status === "operational" ? 200 : 500;
        return res.status(statusCode).json(data);
    } catch (err: any) {
        return res.status(500).json({
            status: "error",
            message: err.message || "Failed to load status details"
        });
    }
};
