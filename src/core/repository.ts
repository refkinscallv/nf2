'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.2.1
 * @license MIT
 */
import { Repository as TypeOrmRepository, DeepPartial, Like, In, ObjectLiteral, SelectQueryBuilder } from 'typeorm'
import Database from '@core/typeorm.core'
import { isObject, isString, isNumber } from 'lodash'
import { PaginateParams, PaginateResult } from '@type/core'
import Paginate from '@core/paginate.core'
import Logger from './logger.core'

export default abstract class Repository<T extends ObjectLiteral> {
    static entityClass: new () => any
    protected static idKey: string = 'id'

    public static get entity(): TypeOrmRepository<any> {
        if (!this.entityClass) {
            Logger.error('REPOSITORY - Missing entityClass in subclass')
        }
        return Database.instance.getRepository(this.entityClass)
    }

    public static async pagination<T extends ObjectLiteral>(this: typeof Repository<T>, params: PaginateParams<T>): Promise<PaginateResult<T>> {
        return Paginate.make(this.entity, params)
    }

    public static normalizeRelations(relations?: string | string[]): string[] {
        if (!relations) return []
        if (Array.isArray(relations)) return relations.map((r) => r.trim()).filter(Boolean)
        return relations
            .split(',')
            .map((r) => r.trim())
            .filter(Boolean)
    }

    public static buildWhere(index: string | number | Record<string, any> | string[], value?: string | number | string[] | null): Record<string, any> | undefined {
        if (Array.isArray(index)) {
            return Object.fromEntries(
                index.map((key) => {
                    if (Array.isArray(value)) return [key, In(value)]
                    if (isString(value) || isNumber(value)) return [key, Like(`%${value}%`)]
                    return [key, value]
                }),
            )
        }

        if (isObject(index)) {
            return Object.fromEntries(
                Object.entries(index).map(([key, val]) => {
                    if (Array.isArray(val)) return [key, In(val)]
                    if (isString(val) || isNumber(val)) return [key, Like(`%${val}%`)]
                    return [key, val]
                }),
            )
        }

        if (typeof index === 'string') {
            return {
                [index]: Array.isArray(value) ? In(value) : Like(`%${value}%`),
            }
        }

        return undefined
    }

    public static resolveCriteria(criteria: string | number | Record<string, any>): Record<string, any> {
        return typeof criteria === 'string' || typeof criteria === 'number' ? { [this.idKey]: criteria } : { ...criteria }
    }

    public static async all<T = any>(relations: string | string[] = []): Promise<T[]> {
        return this.entity.find({
            relations: this.normalizeRelations(relations),
        })
    }

    public static async by<T = any>(index: string | number | Record<string, any> | string[], value?: string | number | string[] | null, relations: string | string[] = []): Promise<T[]> {
        const where = this.buildWhere(index, value)
        if (!where) return []
        return this.entity.find({
            where,
            relations: this.normalizeRelations(relations),
        })
    }

    public static async findOne<T = any>(criteria: string | number | Record<string, any>, relations: string | string[] = []): Promise<T | null> {
        return this.entity.findOne({
            where: this.resolveCriteria(criteria),
            relations: this.normalizeRelations(relations),
        })
    }

    public static async findMany<T = any>(criteria: Record<string, any>, relations: string | string[] = []): Promise<T[]> {
        return this.entity.find({
            where: criteria,
            relations: this.normalizeRelations(relations),
        })
    }

    public static async store<T = any>(data: DeepPartial<T>): Promise<T> {
        return this.entity.save(this.entity.create(data))
    }

    public static async bulkStore<T = any>(data: DeepPartial<T>[]): Promise<T[]> {
        return this.entity.save(this.entity.create(data))
    }

    public static async update<T = any>(data: DeepPartial<T>, criteria: string | number | Record<string, any>): Promise<T | null> {
        if (!data || Object.keys(data).length === 0) return null
        const where = this.resolveCriteria(criteria)
        const result = await this.entity.update(where, data)
        return result.affected !== 0 ? this.entity.findOne({ where }) : null
    }

    public static async delete(criteria: string | number | Record<string, any>): Promise<boolean> {
        const result = await this.entity.delete(this.resolveCriteria(criteria))
        return result.affected !== 0
    }

    public static async softDelete(criteria: string | number | Record<string, any>): Promise<boolean> {
        const result = await this.entity.softDelete(this.resolveCriteria(criteria))
        return result.affected !== 0
    }

    public static async restore(criteria: string | number | Record<string, any>): Promise<boolean> {
        const result = await this.entity.restore(this.resolveCriteria(criteria))
        return result.affected !== 0
    }

    public static async exists(criteria: Record<string, any>): Promise<boolean> {
        return (await this.entity.count({ where: criteria })) > 0
    }

    public static async count(where?: Record<string, any>): Promise<number> {
        return this.entity.count({ where })
    }

    public static findWithQueryBuilder(alias: string): SelectQueryBuilder<any> {
        return this.entity.createQueryBuilder(alias)
    }

    public static async raw(query: string, params: any[] = []): Promise<any> {
        return this.entity.query(query, params)
    }
}
