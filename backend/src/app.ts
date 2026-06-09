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
import "./models/index.model.js";

//utils
import logger from "./utils/logger.util.js"

//middleware
import { sessionMetadataMiddleware } from "./middleware/sessionMetadata.middleware.js";

//routes
import healthRouter from "./routes/health.route.js";
import authRouter from "./routes/v1/auth/auth.route.js";
import statusRouter from "./routes/status.route.js";
import productRouter from "./routes/v1/product/product.route.js";

import globalErrorHandler from "./middleware/errorHandler.middleware.js";

const app = express();

// Initialize Redis Store
const redisStore = new RedisStore({
    client: redis,
    prefix: "sess:",
});

app.use(cors({
    origin: "*",
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

app.use(sessionMetadataMiddleware);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({
    limit: "512kb",
    strict: true,
    type: "application/json",
}));

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);

app.use(statusRouter);

app.use(globalErrorHandler);

const connectWithDatabase = async () => {
    try {
        await connectDB();
        await sequelize.sync({
            alter: Boolean(config.DB.FORCE_ALTER_TABLE === "true"),
            force: Boolean(config.DB.FORCE_DROP_TABLE === "true")
        });
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