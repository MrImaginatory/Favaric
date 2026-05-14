import winston from "winston";
import fs from "fs";

if (!fs.existsSync("./logs")) {
    fs.mkdirSync("./logs");
}

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const loggerInstance = winston.createLogger({
    level: "info",

    format: combine(
        timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        logFormat
    ),

    transports: [
        // All Logs
        new winston.transports.File({
            filename: "logs/combined.log",
        }),

        // Error Logs
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
    ],
});


// Console Logs in Development
if (process.env.NODE_ENV !== "production") {
    loggerInstance.add(
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp({
                    format: "YYYY-MM-DD HH:mm:ss",
                }),
                logFormat
            ),
        })
    );
}


const logger = {
    log: (message: string) => {
        loggerInstance.info(message);
    },

    success: (message: string) => {
        loggerInstance.info(`✅ ${message}`);
    },

    warn: (message: string) => {
        loggerInstance.warn(`⚠️ ${message}`);
    },

    error: (message: string) => {
        loggerInstance.error(`❌ ${message}`);
    },
};

export default logger;