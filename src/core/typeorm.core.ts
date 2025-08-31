'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.2.1
 * @license MIT
 */
import 'reflect-metadata'
import { DataSource, DataSourceOptions, ObjectLiteral, Repository } from 'typeorm'
import CoreCommon from '@core/common.core'
import DatabaseConfig from '@app/config/database.config'
import RegisterSeeder from '@app/database/seeders/register.seeder'
import { TypeOrmDialect, RunSeederType } from '@type/core'
import Logger from '@core/logger.core'

export default class CoreTypeorm {
    private static datasource: DataSource | null = null
    private static databaseType: TypeOrmDialect

    public static get instance(): DataSource | any {
        if (!this.datasource) {
            Logger.error('DATABASE - Database not initialized. Call `CoreTypeorm.init()` first.')
            return null
        }
        return this.datasource
    }

    public static get config(): DataSourceOptions | any {
        this.databaseType = CoreCommon.env<TypeOrmDialect>('DB_TYPE', 'mysql')

        if (!DatabaseConfig[this.databaseType]) {
            Logger.error(`DATABASE - Database configuration for type '${this.databaseType}' not found.`)
            return null
        }

        return {
            type: this.databaseType as any,
            ...DatabaseConfig.common,
            ...DatabaseConfig[this.databaseType],
        }
    }

    public static async init(): Promise<void> {
        if (this.datasource?.isInitialized) {
            Logger.error('DATABASE - Database already initialized.')
            return
        }

        this.datasource = new DataSource(this.config || {})

        try {
            await this.datasource.initialize()
            Logger.info(`DATABASE - Database initialized successfully: ${this.databaseType}`)

            if (CoreCommon.env<string>('DB_SEED', 'off') === 'on') {
                await RegisterSeeder()
            }
        } catch (err: any) {
            Logger.error('DATABASE - Failed to initialize database', err)
        }
    }

    public static async executeSeed<T extends ObjectLiteral>({ entity, data }: RunSeederType<T>) {
        const repository = this.getRepository(entity)
        if (!repository) return

        const entityName = entity.name.replace(/(Entity)?$/i, '')

        if (!Array.isArray(data) || !data.length) {
            Logger.info(`SEEDER - No data for ${entityName}, skipping`)
            return
        }

        const tableName = repository.metadata.tableName

        await repository.query(`SET FOREIGN_KEY_CHECKS = 0;`)
        await repository.query(`TRUNCATE TABLE \`${tableName}\``)
        await repository.query(`SET FOREIGN_KEY_CHECKS = 1;`)

        const cleanData = data.map((row) => {
            const { id, ...rest } = row as any
            return rest
        })

        await repository.createQueryBuilder().insert().into(entity).values(cleanData).execute()
    }

    public static getRepository<T extends ObjectLiteral>(entity: { new (): T }): Repository<T> | null {
        if (!this.datasource?.isInitialized) {
            Logger.error('DATABASE - Not initialized. Call `CoreTypeorm.init()` first.')
            return null
        }

        return this.datasource.getRepository(entity)
    }
}
