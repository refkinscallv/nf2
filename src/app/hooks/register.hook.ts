import CoreHook from '@core/hooks.core'

/**
 * Registers the before hook for the system.
 * This hook is executed before the system is initialized.
 * It can be used for tasks that need to run before the system starts, such as setting up configurations or preparing resources.
 * It is typically called during the application startup process to ensure the system is ready for initialization.
 */
CoreHook.register('system', 'before', async () => {
    console.log('[HOOK] Hook : before system')
    /**
     * Here you can add pre-initialization logic, such as setting up configurations or preparing resources.
     * For example:
     * import ExampleConfig from '@app/config/example.config'
     * await ExampleConfig()
     */
})

/**
 * Registers the after hook for the system.
 * This hook is executed after the system has been initialized.
 * It can be used for tasks that need to run after the system is fully set up.
 * It is typically called during the application startup process to perform post-initialization tasks.
 * This can include logging, starting background tasks, or other setup operations.
 */
CoreHook.register('system', 'after', async () => {
    console.log('[HOOK] Hook : after system')
    /**
     * Here you can add post-initialization logic, such as starting background tasks or logging.
     * For example:
     * import ExampleSeeder from '@app/database/seeders/example.seeder'
     * await ExampleSeeder()
     */
})

/**
 * Registers the shutdown hook for the system.
 * This hook is executed when the system is shutting down.
 * It can be used for cleanup tasks, such as closing database connections, stopping background tasks, or releasing resources.
 * It is typically called when the application is terminating to ensure a graceful shutdown.
 * This helps prevent data loss and ensures that all resources are properly released.
 */
CoreHook.register('system', 'shutdown', async () => {
    console.log('[HOOK] Hook : shutdown system')
    /**
     * Here you can add cleanup logic, such as closing database connections or stopping services.
     * For example:
     * await Cron.close()
     */
})

export default {}
