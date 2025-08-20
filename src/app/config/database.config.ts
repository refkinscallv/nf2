'use strict'

import CoreCommon from '@core/common.core'

/**
 * DatabaseConfig class provides configuration settings for different database types.
 * It retrieves configuration values from environment variables.
 * It includes common settings and specific settings for MySQL, PostgreSQL, SQLite, MongoDB, and Oracle databases.
 * The configuration is structured to be used with TypeORM, allowing for easy database connection and management.
 */
export default class DatabaseConfig {
    /**
     * Common configuration settings for all database types.
     * It includes entity paths, synchronization settings, logging options, and character set.
     */
    public static common: Record<string, any> = {
        entities: [CoreCommon.env<string>('APP_ENV', 'development') === 'development' ? 'src/app/database/entities/*.{ts,js}' : 'dist/app/database/entities/*.js'],
        synchronize: CoreCommon.env<string>('DB_SYNC', 'off') === 'on',
        logging: CoreCommon.env<string>('DB_LOGGING', 'off') === 'on',
        charset: CoreCommon.env<string>('DB_CHARSET', 'utf8mb4_general_ci'),
    }

    /**
     * MySQL database configuration settings.
     * It includes host, port, username, password, and database name.
     * The default values are set to common MySQL defaults.
     * This is useful for applications that use MySQL as their database.
     */
    public static mysql: Record<string, any> = {
        host: CoreCommon.env<string>('DB_HOST', 'localhost'),
        port: CoreCommon.env<number>('DB_PORT', 3306),
        username: CoreCommon.env<string>('DB_USER', 'root'),
        password: CoreCommon.env<string>('DB_PASS', ''),
        database: CoreCommon.env<string>('DB_NAME', ''),
    }

    /**
     * PostgreSQL database configuration settings.
     * It includes host, port, username, password, database name, and schema.
     * The schema defaults to 'public' if not specified.
     * This is useful for applications that use PostgreSQL as their database.
     */
    public static postgres: Record<string, any> = {
        host: CoreCommon.env<string>('DB_HOST', 'localhost'),
        port: CoreCommon.env<number>('DB_PORT', 5432),
        username: CoreCommon.env<string>('DB_USER', 'postgres'),
        password: CoreCommon.env<string>('DB_PASS', ''),
        database: CoreCommon.env<string>('DB_NAME', ''),
        schema: CoreCommon.env<string>('DB_SCHEMA', 'public'),
    }

    /**
     * SQLite database configuration settings.
     * It includes the path to the SQLite database file.
     * It defaults to 'database.sqlite' if not specified.
     * This is useful for development and testing purposes.
     */
    public static sqlite: Record<string, any> = {
        database: CoreCommon.env<string>('DB_PATH', 'database.sqlite'),
    }

    /**
     * MongoDB database configuration settings.
     * It includes the URL for connecting to the MongoDB instance.
     * It defaults to 'mongodb://localhost:27017' if not specified.
     * This is useful for applications that use MongoDB as their database.
     */
    public static mongodb: Record<string, any> = {
        url: CoreCommon.env<string>('DB_URL', 'mongodb://localhost:27017'),
        useUnifiedTopology: true,
    }

    /**
     * Oracle database configuration settings.
     * It includes host, port, username, password, SID, and connect string.
     * The default values are set to common Oracle defaults.
     * This is useful for applications that use Oracle as their database.
     */
    public static oracle: Record<string, any> = {
        host: CoreCommon.env<string>('DB_HOST', 'localhost'),
        port: CoreCommon.env<number>('DB_PORT', 1521),
        username: CoreCommon.env<string>('DB_USER', 'system'),
        password: CoreCommon.env<string>('DB_PASS', ''),
        sid: CoreCommon.env<string>('DB_SID', 'xe'),
        connectString: CoreCommon.env<string>('DB_CONNECT_STRING', ''),
    }
}
