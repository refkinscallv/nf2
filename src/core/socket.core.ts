'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.2.1
 * @license MIT
 */
import { Server } from 'socket.io'
import CoreServer from '@core/server.core'
import SocketConfig from '@app/config/socket.config'
import Logger from '@core/logger.core'

export default class CoreSocket {
    public static readonly io: Server = new Server(CoreServer.getHttpServer(), {
        cors: SocketConfig.cors,
    })

    public static init(): void {
        this.io.on('connection', (socket) => {
            Logger.info(`SOCKET - Client connected: ${socket.id}`)
        })

        this.io.on('error', (err) => {
            if (err instanceof Error) {
                Logger.error(`SOCKET - Failed to start application: ${err.message}`, err)
            } else {
                Logger.error('SOCKET - Failed to start application: Unknown error', new Error(String(err)))
            }
        })
    }
}
