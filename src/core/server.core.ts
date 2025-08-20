'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.1.0
 * @license MIT
 */
import http from 'http'
import CoreCommon from '@core/common.core'
import CoreExpress from '@core/express.core'
import CoreHook from '@core/hooks.core'

/**
 * CoreServer is responsible for initializing and managing the HTTP server.
 * It sets up the server to listen on a specified port and handles system hooks before and after server startup.
 * It also provides methods to retrieve the HTTP server instance.
 */
export default class CoreServer {
    /**
     * The port on which the server will listen.
     * It is retrieved from environment variables and must be a valid number.
     */
    private static readonly port = Number(CoreCommon.env<number>('APP_PORT', 3000))
    /**
     * The URL of the application, constructed from the environment variables.
     * It defaults to 'http://localhost:3000' if not specified.
     */
    private static readonly url = CoreCommon.env<string>('APP_URL', `http://localhost:${CoreServer.port}`)
    /**
     * The HTTP server instance created using the Express application.
     * It is initialized when the server starts.
     */
    private static readonly server = http.createServer(CoreExpress.express)

    /**
     * Retrieves the HTTP server instance.
     * @return {http.Server} The HTTP server instance.
     */
    public static getHttpServer(): http.Server {
        return this.server
    }

    /**
     * Initializes the server by setting it to listen on the specified port.
     * It also initializes system hooks before and after the server starts.
     * If an error occurs during initialization, it logs the error and exits the process.
     * @returns {Promise<void>} A promise that resolves when the server is successfully initialized.
     * @throws {Error} If the server fails to start, an error is logged and the
     */
    public static async init(): Promise<void> {
        this.server.listen(this.port, async () => {
            console.log(`[SERVER] Running at: ${this.url}`)
            try {
                await CoreHook.init('system', 'after')
            } catch (err) {
                console.error('[SERVER] Hook init failed:', err)
            }
        })

        this.server.on('error', (err) => {
            console.error('[SERVER] Server error:', err)
            process.exit(1)
        })
    }
}
