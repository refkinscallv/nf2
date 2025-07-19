import CoreCommon from '@core/common.core';

export default class DatabaseConfig {
    public static common: Record<string, any> = {
        entities: [
            CoreCommon.env<string>('APP_ENV', 'development') === 'development'
                ? 'src/app/database/entities/*.{ts,js}'
                : 'dist/app/database/entities/*.js',
        ],
        synchronize: CoreCommon.env<string>('DB_SYNC', 'off') === 'on',
        logging: CoreCommon.env<string>('DB_LOGGING', 'off') === 'on',
        charset: CoreCommon.env<string>('DB_CHARSET', 'utf8mb4_general_ci'),
    };

    public static mysql: Record<string, any> = {
        host: CoreCommon.env<string>('DB_HOST', 'localhost'),
        port: CoreCommon.env<number>('DB_PORT', 3306),
        username: CoreCommon.env<string>('DB_USER', 'root'),
        password: CoreCommon.env<string>('DB_PASS', ''),
        database: CoreCommon.env<string>('DB_NAME', ''),
    };

    public static postgres: Record<string, any> = {
        host: CoreCommon.env<string>('DB_HOST', 'localhost'),
        port: CoreCommon.env<number>('DB_PORT', 5432),
        username: CoreCommon.env<string>('DB_USER', 'postgres'),
        password: CoreCommon.env<string>('DB_PASS', ''),
        database: CoreCommon.env<string>('DB_NAME', ''),
        schema: CoreCommon.env<string>('DB_SCHEMA', 'public'),
    };

    public static sqlite: Record<string, any> = {
        database: CoreCommon.env<string>('DB_PATH', 'database.sqlite'),
    };

    public static mongodb: Record<string, any> = {
        url: CoreCommon.env<string>('DB_URL', 'mongodb://localhost:27017'),
        useUnifiedTopology: true,
    };

    public static oracle: Record<string, any> = {
        host: CoreCommon.env<string>('DB_HOST', 'localhost'),
        port: CoreCommon.env<number>('DB_PORT', 1521),
        username: CoreCommon.env<string>('DB_USER', 'system'),
        password: CoreCommon.env<string>('DB_PASS', ''),
        sid: CoreCommon.env<string>('DB_SID', 'xe'),
        connectString: CoreCommon.env<string>('DB_CONNECT_STRING', ''),
    };
}
