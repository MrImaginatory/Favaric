import { Sequelize } from '@sequelize/core';
import { SqliteDialect } from '@sequelize/sqlite3';
import logger from '../utils/logger.util.js';

const sqlite = new Sequelize<any>({
    dialect: SqliteDialect,
    storage: './security.db',
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
    },
});

const connectSQLite = async () => {
    try {
        await sqlite.authenticate();
        logger.success("SQLite Security database connection has been established successfully. 🔐");
        // Sync the security database
        await sqlite.sync();
        logger.success("SQLite Security models synced.");
    } catch (error: any) {
        logger.error(`Failed to initialize SQLite connection. ${error.message}`);
    }
}

export default sqlite;
export { connectSQLite };
