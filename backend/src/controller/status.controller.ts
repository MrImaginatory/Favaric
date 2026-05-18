import type { Request, Response } from "express";
import sequelize from "../database/database.js";
import redis from "../utils/redis.util.js";
import config from "../configs/constant.config.js";

// Helper to format bytes into MB
const formatMB = (bytes: number): string => {
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
};

// Helper to format uptime into a readable string
const formatUptime = (seconds: number): string => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const parts: string[] = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);

    return parts.join(" ");
};

export const getStatusData = async () => {
    // 1. Gather System Metrics
    const uptimeSeconds = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    const systemMetrics = {
        uptime: formatUptime(uptimeSeconds),
        uptimeSeconds,
        memory: {
            heapUsed: formatMB(memoryUsage.heapUsed),
            heapTotal: formatMB(memoryUsage.heapTotal),
            rss: formatMB(memoryUsage.rss),
            external: formatMB(memoryUsage.external || 0),
        },
        platform: process.platform,
        nodeVersion: process.version,
        environment: config.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
    };

    // 2. Check Database Connection
    let dbStatus = "operational";
    let dbError = null;
    try {
        await sequelize.authenticate();
    } catch (err: any) {
        dbStatus = "disrupted";
        dbError = err.message || "Failed to authenticate with database";
    }

    // 3. Check Redis Connection
    let redisStatus = "operational";
    let redisError = null;
    try {
        // Fast ping to verify Redis is actually responding
        const pingPromise = redis.ping();
        const timeoutPromise = new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error("Redis ping timeout")), 2000)
        );
        const pingResult = await Promise.race([pingPromise, timeoutPromise]);
        
        if (pingResult !== "PONG" && redis.status !== "ready") {
            redisStatus = "disrupted";
            redisError = `Redis responded with status: ${redis.status}`;
        }
    } catch (err: any) {
        redisStatus = "disrupted";
        redisError = err.message || "Failed to connect to Redis";
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
                status: "operational",
                metrics: systemMetrics
            },
            database: {
                name: "PostgreSQL Database",
                status: dbStatus,
                host: config.DB.DBHOST,
                port: config.DB.DBPORT,
                databaseName: config.DB.DBNAME,
                error: dbError
            },
            cache: {
                name: "Redis Cache Store",
                status: redisStatus,
                host: config.REDIS.HOST,
                port: config.REDIS.PORT,
                error: redisError
            }
        }
    };
};

/**
 * Controller to serve the HTML Status Dashboard
 */
export const showStatusPage = async (_req: Request, res: Response) => {
    try {
        const data = await getStatusData();
        const isOperational = data.status === "operational";
        
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>System Status | Favaric</title>
  <meta http-equiv="refresh" content="30">
  <style>
    :root {
      --bg-color: #f8fafc;
      --card-bg: #ffffff;
      --border-color: #e2e8f0;
      --text-main: #0f172a;
      --text-muted: #64748b;
      
      --green-bg: #f0fdf4;
      --green-border: #bbf7d0;
      --green-text: #166534;
      --green-indicator: #22c55e;
      
      --red-bg: #fef2f2;
      --red-border: #fecaca;
      --red-text: #991b1b;
      --red-indicator: #ef4444;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: var(--bg-color);
      color: var(--text-main);
      margin: 0;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
      line-height: 1.5;
    }

    .container {
      width: 100%;
      max-width: 680px;
    }

    .header {
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.025em;
    }

    .logo span {
      font-weight: 400;
      color: var(--text-muted);
    }

    .api-badge {
      font-size: 11px;
      font-weight: 600;
      background-color: #e2e8f0;
      color: #334155;
      padding: 4px 8px;
      border-radius: 4px;
      text-decoration: none;
      transition: background-color 0.2s;
    }

    .api-badge:hover {
      background-color: #cbd5e1;
    }

    .banner {
      padding: 16px 20px;
      border-radius: 8px;
      margin-bottom: 24px;
      font-weight: 600;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    .banner.success {
      background-color: var(--green-bg);
      border: 1px solid var(--green-border);
      color: var(--green-text);
    }

    .banner.error {
      background-color: var(--red-bg);
      border: 1px solid var(--red-border);
      color: var(--red-text);
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }

    .card-title {
      font-size: 15px;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 12px;
    }

    .status-badge {
      font-size: 12px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }

    .dot.green {
      background-color: var(--green-indicator);
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15);
      animation: pulse-green 2s infinite;
    }

    .dot.red {
      background-color: var(--red-indicator);
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
      animation: pulse-red 2s infinite;
    }

    @keyframes pulse-green {
      0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
      70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
      100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
    }

    @keyframes pulse-red {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
      70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    @media (max-width: 520px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }

    .metric-item {
      display: flex;
      flex-direction: column;
    }

    .metric-label {
      color: var(--text-muted);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }

    .metric-value {
      font-weight: 500;
      color: #334155;
      font-size: 14px;
      word-break: break-all;
    }

    .error-box {
      margin-top: 12px;
      padding: 10px 14px;
      background-color: var(--red-bg);
      border: 1px solid var(--red-border);
      border-radius: 6px;
      font-family: monospace;
      font-size: 12px;
      color: var(--red-text);
      word-break: break-all;
    }

    .footer {
      text-align: center;
      color: var(--text-muted);
      font-size: 12px;
      margin-top: 32px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .refresh-badge {
      display: inline-flex;
      align-self: center;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--text-muted);
      background-color: #f1f5f9;
      padding: 4px 10px;
      border-radius: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Favaric <span>Status</span></div>
      <a href="/status/json" class="api-badge" target="_blank">View JSON API</a>
    </div>

    <div class="banner ${isOperational ? 'success' : 'error'}">
      <span class="dot ${isOperational ? 'green' : 'red'}"></span>
      <span>${isOperational ? 'All Systems Operational' : 'Service Disruptions Detected'}</span>
    </div>

    <!-- API Server -->
    <div class="card">
      <div class="card-title">
        <span>${data.services.api.name}</span>
        <span class="status-badge">
          <span class="dot green"></span>
          Operational
        </span>
      </div>
      <div class="metrics-grid">
        <div class="metric-item">
          <span class="metric-label">Uptime</span>
          <span class="metric-value">${data.services.api.metrics.uptime}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Memory Heap Used</span>
          <span class="metric-value">${data.services.api.metrics.memory.heapUsed}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Memory RSS</span>
          <span class="metric-value">${data.services.api.metrics.memory.rss}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Node Version</span>
          <span class="metric-value">${data.services.api.metrics.nodeVersion}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Platform</span>
          <span class="metric-value">${data.services.api.metrics.platform}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Environment</span>
          <span class="metric-value">${data.services.api.metrics.environment}</span>
        </div>
      </div>
    </div>

    <!-- Database -->
    <div class="card">
      <div class="card-title">
        <span>${data.services.database.name}</span>
        <span class="status-badge">
          <span class="dot ${data.services.database.status === 'operational' ? 'green' : 'red'}"></span>
          ${data.services.database.status === 'operational' ? 'Operational' : 'Outage'}
        </span>
      </div>
      <div class="metrics-grid">
        <div class="metric-item">
          <span class="metric-label">Database Host</span>
          <span class="metric-value">${data.services.database.host || "localhost"}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Database Port</span>
          <span class="metric-value">${data.services.database.port || "5432"}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Database Name</span>
          <span class="metric-value">${data.services.database.databaseName || "ecommerce"}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Connection Protocol</span>
          <span class="metric-value">PostgreSQL</span>
        </div>
      </div>
      ${data.services.database.error ? `
        <div class="error-box">
          <strong>Database Error:</strong><br>${data.services.database.error}
        </div>
      ` : ""}
    </div>

    <!-- Redis Cache -->
    <div class="card">
      <div class="card-title">
        <span>${data.services.cache.name}</span>
        <span class="status-badge">
          <span class="dot ${data.services.cache.status === 'operational' ? 'green' : 'red'}"></span>
          ${data.services.cache.status === 'operational' ? 'Operational' : 'Outage'}
        </span>
      </div>
      <div class="metrics-grid">
        <div class="metric-item">
          <span class="metric-label">Cache Host</span>
          <span class="metric-value">${data.services.cache.host || "localhost"}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Cache Port</span>
          <span class="metric-value">${data.services.cache.port || "6379"}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Service Type</span>
          <span class="metric-value">Redis Cache / Session Store</span>
        </div>
      </div>
      ${data.services.cache.error ? `
        <div class="error-box">
          <strong>Cache Error:</strong><br>${data.services.cache.error}
        </div>
      ` : ""}
    </div>

    <div class="footer">
      <span>Last checked at ${data.checkedAt}</span>
      <div class="refresh-badge">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
        </svg>
        <span>Autorefreshes every 30s</span>
      </div>
    </div>
  </div>
</body>
</html>`;
        
        res.setHeader("Content-Type", "text/html");
        return res.status(isOperational ? 200 : 500).send(html);
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
