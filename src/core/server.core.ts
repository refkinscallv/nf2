'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.2.1
 * @license MIT
 */
import http from 'http'
import CoreCommon from '@core/common.core'
import CoreExpress from '@core/express.core'
import CoreHook from '@core/hooks.core'
import Logger from '@core/logger.core'

export default class CoreServer {
    private static readonly port = Number(CoreCommon.env<number>('APP_PORT', 3000))
    private static readonly url = CoreCommon.env<string>('APP_URL', `http://localhost:${CoreServer.port}`)
    private static readonly server = http.createServer(CoreExpress.express)

    public static getHttpServer(): http.Server {
        return this.server
    }

    public static async init(): Promise<void> {
        this.server.listen(this.port, async () => {
            Logger.info(`SERVER - Running at: ${this.url}`)
            try {
                await CoreHook.init('system', 'after')
            } catch (err) {
                if (err instanceof Error) {
                    Logger.error(`SERVER - Failed to start application: ${err.message}`, err)
                } else {
                    Logger.error('SERVER - Failed to start application: Unknown error', new Error(String(err)))
                }
            }
        })

        this.server.on('error', (err) => {
            if (err instanceof Error) {
                Logger.error(`SERVER - Failed to start application: ${err.message}`, err)
            } else {
                Logger.error('SERVER - Failed to start application: Unknown error', new Error(String(err)))
            }
            process.exit(1)
        })
    }
}
