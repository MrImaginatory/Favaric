import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
import config from "../configs/constant.config.js"
import logger from '../utils/logger.util.js';

const sequelize = new Sequelize<any>({
    dialect: PostgresDialect,
    database: config.DB.DB_NAME,
    user: config.DB.DB_USER,
    password: config.DB.DB_PASSWORD,
    host: config.DB.DB_HOST,
    port: Number(config.DB.DB_PORT),

    // logging: config.NODE_ENV === "production" ? false : console.log,

    pool: {
        max: Number(config.DB.POOL.MAX),
        min: Number(config.DB.POOL.MIN),
        acquire: Number(config.DB.POOL.ACQUIRE),
        idle: Number(config.DB.POOL.IDLE),
    },

    retry: {
        max: Number(config.DB.RETRY.MAX),
    },

    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
    },


    timezone: "+00:00",
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        logger.success("Database connection has been established successfully. 🛢️");
    } catch (error: any) {
        logger.error(`Failed to initialize database connection. ${error.message}`);
    }
}


export default sequelize;
export { connectDB };