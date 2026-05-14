//Packages
import express from "express";
import cors from "cors";


//configs
import config from "./configs/constant.config.js";

//databases
import sequelize, { connectDB } from "./database/database.js";
import "./models/index.model.js";

//utils
import logger from "./utils/logger.util.js"

//routes
import healthRouter from "./routes/health.route.js";


const app = express();

app.use(cors());
app.set('trust proxy', true);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({
    limit: "512kb",
    strict: true,
    type: "application/json",
}));

app.use("/api", healthRouter);

const connectWithDatabase = async () => {
    try {
        await connectDB();
        await sequelize.sync({ alter: true });
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