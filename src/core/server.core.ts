'use strict';

import http from 'http';
import CoreCommon from '@core/common.core';
import CoreExpress from '@core/express.core';
import CoreHook from '@core/hooks.core';

export default class CoreServer {
    private static readonly port = Number(
        CoreCommon.env<number>('APP_PORT', 3000),
    );
    private static readonly url = CoreCommon.env<string>(
        'APP_URL',
        `http://localhost:${CoreServer.port}`,
    );
    private static readonly server = http.createServer(CoreExpress.express);

    public static getHttpServer(): http.Server {
        return this.server;
    }

    public static async init(): Promise<void> {
        this.server.listen(this.port, async () => {
            console.log(`[SERVER] Running at: ${this.url}`);
            try {
                await CoreHook.init('system', 'after');
            } catch (err) {
                console.error('[SERVER] Hook init failed:', err);
            }
        });

        this.server.on('error', (err) => {
            console.error('[SERVER] Server error:', err);
            process.exit(1);
        });
    }
}
