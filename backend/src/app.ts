//Packages
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { RedisStore } from "connect-redis";

//configs
import config from "./configs/constant.config.js";
import redis from "./utils/redis.util.js";

//databases
import sequelize, { connectDB } from "./database/database.js";
import { connectSQLite } from "./database/sqlite.js";
import "./models/index.model.js";

//utils
import logger from "./utils/logger.util.js"
import requestLogger from "./middleware/requestLogger.middleware.js";
import { loadAllRefData } from "./services/refCache.service.js";
import UserSession from "./models/users/userSession.model.js";


//middleware
import { sessionMetadataMiddleware } from "./middleware/sessionMetadata.middleware.js";
import { globalLimiter } from "./middleware/rateLimiter.middleware.js";

//routes
import healthRouter from "./routes/health.route.js";
import userRouter from "./routes/v1/user/user.route.js";
import statusRouter from "./routes/status.route.js";
import productRouter from "./routes/v1/product/product.route.js";
import countryCodeRouter from "./routes/v1/application/countryCode.route.js";

import globalErrorHandler from "./middleware/errorHandler.middleware.js";
import { seedCountryCodes } from "./services/seedCountryCodes.service.js";

const app = express();

// Initialize Redis Store
const redisStore = new RedisStore({
    client: redis,
    prefix: "sess:",
});

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());
app.set('trust proxy', true);

app.use(session({
    store: redisStore,
    secret: config.SESSION.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: config.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }
}));

app.use(requestLogger);
app.use(sessionMetadataMiddleware);
app.use(globalLimiter);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({
    limit: "512kb",
    strict: true,
    type: "application/json",
}));

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/countryCodes", countryCodeRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);

// Serve static uploaded files publicly
app.use("/api/v1/uploads", express.static(config.UPLOADS_PATH));

app.use(statusRouter);

app.use(globalErrorHandler);

const connectWithDatabase = async () => {
    try {
        await connectDB();
        await connectSQLite();
        await sequelize.sync({
            alter: Boolean(config.DB.FORCE_ALTER_TABLE === "true"),
            force: Boolean(config.DB.FORCE_DROP_TABLE === "true")
        });
        await loadAllRefData();
        await seedCountryCodes();

        const activeSessions = await UserSession.count();
        await redis.set("active_sessions_count", activeSessions.toString());

        logger.log(`💃 Models synchronized successfully on port ${config.PORT}`);
    } catch (error) {
        logger.error(`❌ Database initialization failed: ${error}`);
        process.exit(1);
    }
}

const startServer = async () => {
    app.listen(config.PORT, () => {
        logger.log(`Server is running on port ${config.PORT}`);
    });
}


export { startServer, connectWithDatabase };