'use strict';

import CoreExpress from '@core/express.core';
import CoreServer from '@core/server.core';
import CoreTypeorm from '@core/typeorm.core';
import CoreHook from '@core/hooks.core';
import CoreCommon from '@core/common.core';

export default class CoreBoot {
    public static async run() {
        console.log(`[BOOT] Boot the application`);

        try {
            await CoreHook.init('system', 'before');
            if (CoreCommon.env('DB_STATUS') === 'on') {
                await CoreTypeorm.init();
            }

            CoreExpress.init();
            CoreServer.init();

            console.log(`[BOOT] Successfully booted the application`);
        } catch (error: any | unknown) {
            throw new Error(`[BOOT] Failed to boot the application: ${error?.message || error}`);
        }
    }
}
