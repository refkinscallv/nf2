'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.2.1
 * @license MIT
 */
import CoreExpress from '@core/express.core'
import CoreServer from '@core/server.core'
import CoreTypeorm from '@core/typeorm.core'
import CoreHook from '@core/hooks.core'
import CoreCommon from '@core/common.core'
import Logger from '@core/logger.core'
import figlet from 'figlet'
import chalk from 'chalk'

export default class CoreBoot {
    public static async run(): Promise<void> {
        // sign start
        const log = console.log
        log('\n')
        log(chalk.gray('============================================================'))
        log('\n')
        log(
            chalk.cyan(
                figlet.textSync('NF2', { font: 'Slant' })
            )
        )
        log('\n')
        log(chalk.yellow('NF2 is a modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM.'))
        log(chalk.green('Author     : Refkinscallv (https://github.com/refkinscallv)'))
        log(chalk.magenta('Repository : https://github.com/refkinscallv/nf2'))
        log(chalk.blue('Version    : 2.2.1'))

        log('\n')
        log(chalk.gray('============================================================'))
        log('\n')
        // sign end

        Logger.info('BOOT - Starting the application')

        try {
            await CoreHook.init('system', 'before')

            if (CoreCommon.env('DB_STATUS') === 'on') {
                Logger.info('BOOT - Initializing database connection')
                await CoreTypeorm.init()
                Logger.info('BOOT - Database connection established')
            } else {
                Logger.debug('BOOT - Database initialization skipped (DB_STATUS=off)')
            }

            Logger.info('BOOT - Initializing Express')
            CoreExpress.init()
            Logger.info('BOOT - Express initialized')

            Logger.info('BOOT - Starting server')
            CoreServer.init()
            Logger.info('BOOT - Server started successfully')

            Logger.info('BOOT - Application started successfully')
        } catch (err) {
            if (err instanceof Error) {
                Logger.error(`BOOT - Failed to start application: ${err.message}`, err)
            } else {
                Logger.error('BOOT - Failed to start application: Unknown error', new Error(String(err)))
            }
            throw err
        }
    }
}
