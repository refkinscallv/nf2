import CoreCommon from '@core/common.core'

/**
 * import seeder here
 */

/**
 * RegisterSeeder is a function that runs the database seeder.
 * It checks the environment variable 'DB_SEED' to determine if seeding is enabled.
 * If enabled, it runs the seeder to populate the database with initial data.
 * This is useful for setting up the database with default values or test data.
 * It is typically called during the application startup process to ensure the database is ready for use.
 * @returns {Promise<void>} A promise that resolves when the seeder has completed.
 */
export default async function RegisterSeeder(): Promise<void> {
    if (CoreCommon.env<string>('DB_SEED', 'off') === 'on') {
        /**
         * Here you can import and run your seeders.
         * For example:
         * import UserSeeder from '@app/database/seeders/user.seeder'
         * await UserSeeder.run()
         */
    }
}
