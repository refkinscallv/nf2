import CoreCommon from '@core/common.core'
import Logger from '@core/logger.core'

/**
 * import seeder here
 */

export default async function RegisterSeeder(): Promise<void> {
    if (CoreCommon.env<string>('DB_SEED', 'off') === 'on') {
        Logger.info('SEEDER - Database seeding started')

        try {
            // set seeder here ex : await SampleSeeder()
            Logger.info('SEEDER - Database seeding completed successfully')
        } catch (err) {
            if (err instanceof Error) {
                Logger.error(`SEEDER - Database seeding failed: ${err.message}`, err)
            } else {
                Logger.error('SEEDER - Database seeding failed: Unknown error', new Error(String(err)))
            }
            throw err
        }
    } else {
        Logger.debug('SEEDER - Skipped (DB_SEED=off)')
    }
}
