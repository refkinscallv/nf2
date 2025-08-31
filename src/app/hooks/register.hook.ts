import CoreHook from '@core/hooks.core'
import Logger from '@core/logger.core'

CoreHook.register('system', 'before', async (): Promise<void> => {
    Logger.info('HOOK - Before system started')

    try {
        /**
         * Add pre-initialization logic here
         * Example:
         * import ExampleConfig from '@app/config/example.config'
         * await ExampleConfig()
         */
        Logger.info('HOOK - Before system completed')
    } catch (err) {
        if (err instanceof Error) {
            Logger.error(`HOOK - Error in system:before: ${err.message}`, err)
        } else {
            Logger.error('HOOK - Error in system:before: Unknown error', new Error(String(err)))
        }
        throw err
    }
})

CoreHook.register('system', 'after', async (): Promise<void> => {
    Logger.info('HOOK - After system started')

    try {
        /**
         * Add post-initialization logic here
         * Example:
         * import ExampleSeeder from '@app/database/seeders/example.seeder'
         * await ExampleSeeder()
         */
        Logger.info('HOOK - After system completed')
    } catch (err) {
        if (err instanceof Error) {
            Logger.error(`HOOK - Error in system:after: ${err.message}`, err)
        } else {
            Logger.error('HOOK - Error in system:after: Unknown error', new Error(String(err)))
        }
        throw err
    }
})

CoreHook.register('system', 'shutdown', async (): Promise<void> => {
    Logger.info('HOOK - Shutdown system started')

    try {
        /**
         * Add cleanup logic here
         * Example:
         * await Cron.close()
         */
        Logger.info('HOOK - Shutdown system completed')
    } catch (err) {
        if (err instanceof Error) {
            Logger.error(`HOOK - Error in system:shutdown: ${err.message}`, err)
        } else {
            Logger.error('HOOK - Error in system:shutdown: Unknown error', new Error(String(err)))
        }
    }
})

export default {}
