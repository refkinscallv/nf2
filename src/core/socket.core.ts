'use strict';

import { Server } from 'socket.io';
import CoreServer from '@core/server.core';
import SocketConfig from '@app/config/socket.config';

export default class CoreSocket {
    public static readonly io: Server = new Server(CoreServer.getHttpServer(), {
        cors: SocketConfig.cors,
    });

    public static init(): void {
        this.io.on('connection', (socket) => {
            console.log(`[SOCKET] Client connected: ${socket.id}`);
        });

        this.io.on('error', (err) => {
            console.error('[SOCKET] Socket.IO Error:', err);
        });
    }
}
