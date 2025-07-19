'use strict';

import 'reflect-metadata';
import {
    DataSource,
    DataSourceOptions,
    ObjectLiteral,
    Repository,
} from 'typeorm';
import CoreCommon from '@core/common.core';
import DatabaseConfig from '@app/config/database.config';
import RegisterSeeder from '@app/database/seeders/register.seeder';
import { TypeOrmDialect, RunSeederType } from '@type/core';

export default class CoreTypeorm {
    private static datasource: DataSource | null = null;
    private static databaseType: TypeOrmDialect;

    public static get instance(): DataSource {
        if (!this.datasource) {
            throw new Error(
                '[DATABASE] Database not initialized. Call `CoreTypeorm.init()` first.',
            );
        }
        return this.datasource;
    }

    public static get config(): DataSourceOptions {
        this.databaseType = CoreCommon.env<TypeOrmDialect>('DB_TYPE', 'mysql');

        if (!DatabaseConfig[this.databaseType]) {
            throw new Error(
                `[DATABASE] Database configuration for type '${this.databaseType}' not found.`,
            );
        }

        return {
            type: this.databaseType as any,
            ...DatabaseConfig.common,
            ...DatabaseConfig[this.databaseType],
        };
    }

    public static async init(): Promise<void> {
        if (this.datasource?.isInitialized) {
            throw new Error('[DATABASE] Database already initialized.');
        }

        this.datasource = new DataSource(this.config);

        try {
            await this.datasource.initialize();
            console.log(
                `[DATABASE] Database initialized successfully: ${this.databaseType}`,
            );

            if (CoreCommon.env<string>('DB_SEED', 'off') === 'on') {
                await RegisterSeeder();
                console.log('[DATABASE] Seeders executed successfully.');
            }
        } catch (err: any) {
            throw new Error(
                `[DATABASE] Failed to initialize database: ${err?.message || err}`,
            );
        }
    }

    public static async executeSeed<T extends ObjectLiteral>({
        entity,
        data,
    }: RunSeederType<T>) {
        const repository = this.getRepository(entity);
        const entityName = entity.name.replace(/(Entity)?$/i, '');

        if (!Array.isArray(data) || !data.length) {
            console.log(`[SEEDER] No data for ${entityName}, skipping`);
            return;
        }

        const allColumns = Object.keys(data[0]);

        await repository
            .createQueryBuilder()
            .insert()
            .into(entity)
            .values(data)
            .orUpdate(allColumns, allColumns)
            .execute();

        console.log(`[SEEDER] '${entityName}' seeded successfully`);
    }

    public static getRepository<T extends ObjectLiteral>(entity: {
        new (): T;
    }): Repository<T> {
        if (!this.datasource?.isInitialized) {
            throw new Error(
                '[DATABASE] Not initialized. Call `CoreTypeorm.init()` first.',
            );
        }

        return this.datasource.getRepository(entity);
    }
}
