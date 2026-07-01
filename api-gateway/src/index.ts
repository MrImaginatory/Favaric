import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5001";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// 1. Security Headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. CORS setup for Gateway
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
}));

// 3. Request Logging
app.use(morgan("combined"));

// 4. Rate Limiting (Global)
// Trust proxy if we are behind Nginx in the future
app.set("trust proxy", 1);
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        error: "Too many requests from this IP, please try again after 15 minutes."
    }
});
app.use(globalLimiter);

// 5. Proxy Configuration
// Pass everything under /api to the backend
app.use("/Ecommerce", createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/Ecommerce': ''
    },
    // The backend uses session cookies, so we want to keep them intact
    cookieDomainRewrite: "localhost",
    on: {
        proxyReq: (proxyReq, req, res) => {
            // Can add custom headers here if needed before sending to backend
        },
        error: (err, req, res) => {
            console.error("Proxy Error:", err);
            if ('writeHead' in res) {
                res.writeHead(502, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    error: "Bad Gateway",
                    message: "Backend service is currently unreachable."
                }));
            }
        }
    }
}));

// Health check endpoint for the gateway itself
app.get("/gateway/health", (req, res) => {
    res.json({
        status: "success",
        message: "API Gateway is running.",
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 API Gateway is running on http://localhost:${PORT}`);
    console.log(`🔄 Proxying /api to backend at ${BACKEND_URL}`);
});
