import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
import config from "../configs/constant.config.js"
import logger from '../utils/logger.util.js';

const sequelize = new Sequelize<any>({
    dialect: PostgresDialect,
    database: config.DB.DBNAME,
    user: config.DB.DBUSER,
    password: config.DB.DBPASSWORD,
    host: config.DB.DBHOST,
    port: Number(config.DB.DBPORT),

    // logging: config.NODE_ENV === "production" ? false : console.log,

    pool: {
        max: 2,
        min: 1,
        acquire: 60000,
        idle: 10000,
    },

    retry: {
        max: 3,
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