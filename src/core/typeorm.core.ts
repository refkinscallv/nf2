'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.1.0
 * @license MIT
 */
import 'reflect-metadata'
import { DataSource, DataSourceOptions, ObjectLiteral, Repository } from 'typeorm'
import CoreCommon from '@core/common.core'
import DatabaseConfig from '@app/config/database.config'
import RegisterSeeder from '@app/database/seeders/register.seeder'
import { TypeOrmDialect, RunSeederType } from '@type/core'

/**
 * CoreTypeorm class provides methods to initialize and manage TypeORM connections.
 * It handles database configuration, initialization, and seeding operations.
 * It also provides a way to get repositories for entities.
 * It is designed to be used as a singleton, ensuring only one instance of the database connection is created throughout the application lifecycle.
 */
export default class CoreTypeorm {
    /**
     * The TypeORM DataSource instance.
     * It is used to manage the database connection and perform operations on the database.
     */
    private static datasource: DataSource | null = null
    /**
     * The type of the database being used.
     * It is determined based on the environment variable 'DB_TYPE'.
     */
    private static databaseType: TypeOrmDialect

    /**
     * Retrieves the DataSource instance.
     * If the DataSource is not initialized, it throws an error.
     * @return {DataSource} The TypeORM DataSource instance.
     * @throws {Error} If the DataSource is not initialized.
     */
    public static get instance(): DataSource {
        if (!this.datasource) {
            throw new Error('[DATABASE] Database not initialized. Call `CoreTypeorm.init()` first.')
        }
        return this.datasource
    }

    /**
     * Retrieves the configuration for the TypeORM DataSource.
     * It constructs the configuration based on the environment variables and the database type.
     * @return {DataSourceOptions} The TypeORM DataSource options.
     * @throws {Error} If the database type is not found in the configuration.
     */
    public static get config(): DataSourceOptions {
        this.databaseType = CoreCommon.env<TypeOrmDialect>('DB_TYPE', 'mysql')

        if (!DatabaseConfig[this.databaseType]) {
            throw new Error(`[DATABASE] Database configuration for type '${this.databaseType}' not found.`)
        }

        return {
            type: this.databaseType as any,
            ...DatabaseConfig.common,
            ...DatabaseConfig[this.databaseType],
        }
    }

    /**
     * Initializes the TypeORM DataSource.
     * It creates a new DataSource instance with the configuration and connects to the database.
     * If the database is already initialized, it throws an error.
     * It also executes seeders if the environment variable 'DB_SEED' is set to 'on'.
     * @returns {Promise<void>} A promise that resolves when the database is successfully initialized.
     * @throws {Error} If the database fails to initialize or if it is already initialized.
     */
    public static async init(): Promise<void> {
        if (this.datasource?.isInitialized) {
            throw new Error('[DATABASE] Database already initialized.')
        }

        this.datasource = new DataSource(this.config)

        try {
            await this.datasource.initialize()
            console.log(`[DATABASE] Database initialized successfully: ${this.databaseType}`)

            if (CoreCommon.env<string>('DB_SEED', 'off') === 'on') {
                await RegisterSeeder()
                console.log('[DATABASE] Seeders executed successfully.')
            }
        } catch (err: any) {
            throw new Error(`[DATABASE] Failed to initialize database: ${err?.message || err}`)
        }
    }

    /**
     * Executes a seeder for a specific entity.
     * It truncates the table for the entity and seeds it with the provided data.
     * If the data is empty, it skips the seeding process.
     * @param {RunSeederType<T>} params The parameters for running the seeder, including the entity and data.
     * @return {Promise<void>} A promise that resolves when the seeder has been executed successfully.
     */
    public static async executeSeed<T extends ObjectLiteral>({ entity, data }: RunSeederType<T>) {
        const repository = this.getRepository(entity)
        const entityName = entity.name.replace(/(Entity)?$/i, '')

        if (!Array.isArray(data) || !data.length) {
            console.log(`[SEEDER] No data for ${entityName}, skipping`)
            return
        }

        const tableName = repository.metadata.tableName
        await repository.query(`TRUNCATE TABLE \`${tableName}\``)

        const cleanData = data.map((row) => {
            const { id, ...rest } = row as any
            return rest
        })

        await repository.createQueryBuilder().insert().into(entity).values(cleanData).execute()

        console.log(`[SEEDER] '${entityName}' truncated & seeded successfully`)
    }

    /**
     * Retrieves a TypeORM repository for a specific entity.
     * It throws an error if the DataSource is not initialized.
     * @param {new () => T} entity The entity class for which to get the repository.
     * @return {Repository<T>} The TypeORM repository for the specified entity.
     * @throws {Error} If the DataSource is not initialized.
     */
    public static getRepository<T extends ObjectLiteral>(entity: { new (): T }): Repository<T> {
        if (!this.datasource?.isInitialized) {
            throw new Error('[DATABASE] Not initialized. Call `CoreTypeorm.init()` first.')
        }

        return this.datasource.getRepository(entity)
    }
}
