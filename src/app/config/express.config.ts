'use strict'

import path from 'path'

/**
 * Express configuration settings.
 * It includes CORS settings and static file serving configuration.
 * CORS settings allow all origins and methods, and expose specific headers.
 * Static files are served from a specified directory with a defined route.
 */
export default class ExpressConfig {
    /**
     * CORS configuration settings.
     * It allows all origins and methods, and exposes specific headers.
     * This is useful for applications that need to handle cross-origin requests.
     * It also allows credentials and sets a maximum age for preflight requests.
     */
    public static cors: Record<string, any> = {
        origin: (origin: unknown, callback: any) => callback(null, true),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD', 'CONNECT', 'TRACE'],
        allowedHeaders: ['X-Requested-With', 'X-Custom-Header', 'Content-Type', 'Authorization', 'Accept', 'Origin', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
        exposedHeaders: ['Content-Range', 'X-Content-Range', 'X-Custom-Header'],
        credentials: true,
        maxAge: 86400,
        preflightContinue: false,
        optionsSuccessStatus: 200,
    }

    /**
     * Static file serving configuration.
     * It defines the route and the path where static files are served from.
     * This is useful for serving assets like images, stylesheets, and scripts.
     * The default route is '/static' and the path is set to a directory relative to the current file.
     * This allows the application to serve static files efficiently.
     */
    public static static: Record<string, any> = {
        route: '/static',
        path: path.join(__dirname, '../../../public/static'),
    }
}
