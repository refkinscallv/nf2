import CoreCommon from '@core/common.core';

// define seeders here

export default async function RegisterSeeder(): Promise<void> {
    if (CoreCommon.env<string>('DB_SEED', 'off') === 'on') {
    }
}
