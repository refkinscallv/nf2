'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.1.0
 * @license MIT
 */
import { Server } from 'socket.io'
import CoreServer from '@core/server.core'
import SocketConfig from '@app/config/socket.config'

/**
 * CoreSocket class provides methods to initialize and manage Socket.IO connections.
 * It sets up the Socket.IO server and handles client connections.
 */
export default class CoreSocket {
    /**
     * Socket.IO server instance.
     * It is created using the HTTP server from CoreServer.
     */
    public static readonly io: Server = new Server(CoreServer.getHttpServer(), {
        cors: SocketConfig.cors,
    })

    /**
     * Initializes the Socket.IO server.
     * This method sets up the connection event listener to handle client connections.
     * It should be called after the HTTP server is initialized.
     * @returns {void} This method does not return anything.
     */
    public static init(): void {
        this.io.on('connection', (socket) => {
            console.log(`[SOCKET] Client connected: ${socket.id}`)
        })

        this.io.on('error', (err) => {
            console.error('[SOCKET] Socket.IO Error:', err)
        })
    }
}
