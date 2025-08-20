'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.1.0
 * @license MIT
 */
import CoreExpress from '@core/express.core'
import CoreServer from '@core/server.core'
import CoreTypeorm from '@core/typeorm.core'
import CoreHook from '@core/hooks.core'
import CoreCommon from '@core/common.core'

/**
 * Bootstraps the application by initializing core components.
 * It sets up the Express server, TypeORM connection, and system hooks.
 */
export default class CoreBoot {
    /**
     * Runs the boot process for the application.
     * It initializes the system hooks, TypeORM if enabled, and starts the Express server.
     * @returns {Promise<void>} A promise that resolves when the boot process is complete.
     * @throws {Error} If the boot process fails, an error is thrown with a descriptive message.
     */
    public static async run() {
        console.log(`[BOOT] Boot the application`)

        try {
            await CoreHook.init('system', 'before')
            if (CoreCommon.env('DB_STATUS') === 'on') {
                await CoreTypeorm.init()
            }

            CoreExpress.init()
            CoreServer.init()

            console.log(`[BOOT] Successfully booted the application`)
        } catch (error: any | unknown) {
            throw new Error(`[BOOT] Failed to boot the application: ${error?.message || error}`)
        }
    }
}
