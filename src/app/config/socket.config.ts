'use strict'

import CoreCommon from '@core/common.core'

/**
 * SocketConfig class provides configuration settings for WebSocket connections.
 * It defines CORS settings for the Socket.IO server.
 * It allows cross-origin requests from the base URL of the application.
 * It also specifies allowed methods, headers, and other CORS-related options.
 * This configuration is essential for enabling WebSocket communication in a secure and controlled manner.
 * It is designed to be used with the Socket.IO server instance.
 * The settings can be customized based on the application's requirements.
 */
export default class SocketConfig {
    /**
     * CORS configuration settings for the Socket.IO server.
     * It allows cross-origin requests from the base URL of the application.
     * It specifies allowed methods, headers, and other CORS-related options.
     * This is useful for applications that need to handle WebSocket connections from different origins.
     *
     */
    public static cors: Record<string, any> = {
        origin: CoreCommon.url('base'),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['X-Requested-With', 'X-Custom-Header', 'Content-Type', 'Authorization', 'Accept', 'Origin', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
        exposedHeaders: ['Content-Range', 'X-Content-Range', 'X-Custom-Header'],
        credentials: true,
        maxAge: 86400,
        preflightContinue: true,
        optionsSuccessStatus: 200,
    }
}
