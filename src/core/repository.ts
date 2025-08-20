'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.1.0
 * @license MIT
 */
import { Repository as TypeOrmRepository, DeepPartial, Like, In, ObjectLiteral, SelectQueryBuilder } from 'typeorm'
import Database from '@core/typeorm.core'
import { isObject, isString, isNumber } from 'lodash'
import { PaginateParams, PaginateResult } from '@type/core'
import Paginate from '@core/paginate.core'

/**
 * Abstract class for a TypeORM repository.
 * Provides common methods for interacting with the database.
 * This class should be extended by specific entity repositories.
 * It includes methods for CRUD operations, pagination, and query building.
 */
export default abstract class Repository<T extends ObjectLiteral> {
    /**
     * The entity class that this repository manages.
     * It must be defined in subclasses.
     */
    static entityClass: new () => any
    /**
     * The primary key field used for identifying entities.
     * Default is 'id', but can be overridden in subclasses.
     */
    protected static idKey: string = 'id'

    /**
     * The TypeORM repository instance for the entity.
     * It is initialized in the static getter `entity`.
     * @return {TypeOrmRepository<any>} The TypeORM repository instance for the entity.
     * @throws {Error} If the entityClass is not defined in the subclass.
     */
    public static get entity(): TypeOrmRepository<any> {
        if (!this.entityClass) {
            throw new Error('Missing entityClass in subclass')
        }
        return Database.instance.getRepository(this.entityClass)
    }

    /**
     * The primary key field used for identifying entities.
     * It can be overridden in subclasses to use a different field.
     * @return {string} The primary key field name.
     */
    public static async pagination<T extends ObjectLiteral>(this: typeof Repository<T>, params: PaginateParams<T>): Promise<PaginateResult<T>> {
        return Paginate.make(this.entity, params)
    }

    /**
     * Normalizes the relations string or array into a consistent format.
     * It trims whitespace and filters out empty strings.
     * @param {string | string[]} relations - The relations to normalize.
     * @return {string[]} An array of normalized relation names.
     */
    public static normalizeRelations(relations?: string | string[]): string[] {
        if (!relations) return []
        if (Array.isArray(relations)) return relations.map((r) => r.trim()).filter(Boolean)
        return relations
            .split(',')
            .map((r) => r.trim())
            .filter(Boolean)
    }

    /**
     * Builds a 'where' clause for TypeORM queries based on the provided index and value.
     * It supports single keys, arrays of keys, and objects as input.
     * @param {string | number | Record<string, any> | string[]} index - The key(s) to filter by.
     * @param {string | number | string[] | null} [value] - The value(s) to match against the key(s).
     * @return {Record<string, any> | undefined} An object representing the 'where' clause or undefined if no valid input is provided.
     */
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

    /**
     * Resolves a criteria object for querying the database.
     * It converts a string or number into an object with the primary key field.
     * If an object is provided, it returns it as is.
     * @param {string | number | Record<string, any>} criteria - The criteria to resolve.
     * @return {Record<string, any>} An object representing the criteria for querying.
     */
    public static resolveCriteria(criteria: string | number | Record<string, any>): Record<string, any> {
        return typeof criteria === 'string' || typeof criteria === 'number' ? { [this.idKey]: criteria } : { ...criteria }
    }

    /**
     * Retrieves all entities from the database, optionally including specified relations.
     * It returns an array of entities or an empty array if none are found.
     * @param {string | string[]} [relations] - The relations to include in the query.
     * @return {Promise<T[]>} A promise that resolves to an array of entities.
     */
    public static async all<T = any>(relations: string | string[] = []): Promise<T[]> {
        return this.entity.find({
            relations: this.normalizeRelations(relations),
        })
    }

    /**
     * Retrieves entities by a specific index and value, optionally including specified relations.
     * It supports single keys, arrays of keys, and objects as input.
     * @param {string | number | Record<string, any> | string[]} index - The key(s) to filter by.
     * @param {string | number | string[] | null} [value] - The value(s) to match against the key(s).
     * @param {string | string[]} [relations] - The relations to include in the query.
     * @return {Promise<T[]>} A promise that resolves to an array of entities matching the criteria.
     */
    public static async by<T = any>(index: string | number | Record<string, any> | string[], value?: string | number | string[] | null, relations: string | string[] = []): Promise<T[]> {
        const where = this.buildWhere(index, value)
        if (!where) return []
        return this.entity.find({
            where,
            relations: this.normalizeRelations(relations),
        })
    }

    /**
     * Retrieves a single entity by its primary key or a specific criteria, optionally including specified relations.
     * It returns the entity if found, or null if not found.
     * @param {string | number | Record<string, any>} criteria - The primary key or criteria to find the entity.
     * @param {string | string[]} [relations] - The relations to include in the query.
     * @return {Promise<T | null>} A promise that resolves to the found entity or null.
     */
    public static async findOne<T = any>(criteria: string | number | Record<string, any>, relations: string | string[] = []): Promise<T | null> {
        return this.entity.findOne({
            where: this.resolveCriteria(criteria),
            relations: this.normalizeRelations(relations),
        })
    }

    /**
     * Retrieves multiple entities based on a criteria object and specified relations.
     * It returns an array of entities matching the criteria.
     * @param {Record<string, any>} criteria - The criteria to filter entities by.
     * @param {string | string[]} [relations] - The relations to include in the query.
     * @return {Promise<T[]>} A promise that resolves to an array of entities matching the criteria.
     */
    public static async findMany<T = any>(criteria: Record<string, any>, relations: string | string[] = []): Promise<T[]> {
        return this.entity.find({
            where: criteria,
            relations: this.normalizeRelations(relations),
        })
    }

    /**
     * Stores a new entity in the database.
     * It creates a new instance of the entity class with the provided data and saves it.
     * @param {DeepPartial<T>} data - The data to create the new entity.
     * @return {Promise<T>} A promise that resolves to the created entity.
     */
    public static async store<T = any>(data: DeepPartial<T>): Promise<T> {
        return this.entity.save(this.entity.create(data))
    }

    /**
     * Stores multiple entities in the database.
     * It creates new instances of the entity class with the provided data and saves them.
     * @param {DeepPartial<T>[]} data - An array of data to create new entities.
     * @return {Promise<T[]>} A promise that resolves to an array of created entities.
     */
    public static async bulkStore<T = any>(data: DeepPartial<T>[]): Promise<T[]> {
        return this.entity.save(this.entity.create(data))
    }

    /**
     * Updates an existing entity in the database based on the provided criteria.
     * It returns the updated entity if successful, or null if no entity was found to update.
     * @param {DeepPartial<T>} data - The data to update the entity with.
     * @param {string | number | Record<string, any>} criteria - The criteria to find the entity to update.
     * @return {Promise<T | null>} A promise that resolves to the updated entity or null if not found.
     */
    public static async update<T = any>(data: DeepPartial<T>, criteria: string | number | Record<string, any>): Promise<T | null> {
        if (!data || Object.keys(data).length === 0) return null
        const where = this.resolveCriteria(criteria)
        const result = await this.entity.update(where, data)
        return result.affected !== 0 ? this.entity.findOne({ where }) : null
    }

    /**
     * Deletes an entity from the database based on the provided criteria.
     * It returns true if the entity was deleted, or false if no entity was found to delete.
     * @param {string | number | Record<string, any>} criteria - The criteria to find the entity to delete.
     * @return {Promise<boolean>} A promise that resolves to true if the entity was deleted, false otherwise.
     */
    public static async delete(criteria: string | number | Record<string, any>): Promise<boolean> {
        const result = await this.entity.delete(this.resolveCriteria(criteria))
        return result.affected !== 0
    }

    /**
     * Soft deletes an entity from the database based on the provided criteria.
     * It marks the entity as deleted without physically removing it from the database.
     * It returns true if the entity was soft deleted, or false if no entity was found to soft delete.
     * @param {string | number | Record<string, any>} criteria - The criteria to find the entity to soft delete.
     * @return {Promise<boolean>} A promise that resolves to true if the entity was soft deleted, false otherwise.
     */
    public static async softDelete(criteria: string | number | Record<string, any>): Promise<boolean> {
        const result = await this.entity.softDelete(this.resolveCriteria(criteria))
        return result.affected !== 0
    }

    /**
     * Restores a soft-deleted entity based on the provided criteria.
     * It marks the entity as active again, allowing it to be queried normally.
     * It returns true if the entity was restored, or false if no entity was found to restore.
     * @param {string | number | Record<string, any>} criteria - The criteria to find the entity to restore.
     * @return {Promise<boolean>} A promise that resolves to true if the entity was restored, false otherwise.
     */
    public static async restore(criteria: string | number | Record<string, any>): Promise<boolean> {
        const result = await this.entity.restore(this.resolveCriteria(criteria))
        return result.affected !== 0
    }

    /**
     * Checks if an entity exists in the database based on the provided criteria.
     * It returns true if at least one entity matches the criteria, or false if none are found.
     * @param {Record<string, any>} criteria - The criteria to check for existence.
     * @return {Promise<boolean>} A promise that resolves to true if the entity exists, false otherwise.
     */
    public static async exists(criteria: Record<string, any>): Promise<boolean> {
        return (await this.entity.count({ where: criteria })) > 0
    }

    /**
     * Counts the number of entities in the database that match the provided criteria.
     * It returns the count as a number.
     * @param {Record<string, any>} [where] - The criteria to filter the count by.
     * @return {Promise<number>} A promise that resolves to the count of matching entities.
     */
    public static async count(where?: Record<string, any>): Promise<number> {
        return this.entity.count({ where })
    }

    /**
     * Finds entities using a custom query builder with the specified alias.
     * It returns a SelectQueryBuilder instance for further query customization.
     * @param {string} alias - The alias to use for the query builder.
     * @return {SelectQueryBuilder<any>} A SelectQueryBuilder instance for the entity.
     */
    public static findWithQueryBuilder(alias: string): SelectQueryBuilder<any> {
        return this.entity.createQueryBuilder(alias)
    }

    /**
     * Executes a raw SQL query against the database.
     * It returns the result of the query execution.
     * @param {string} query - The raw SQL query to execute.
     * @param {any[]} [params] - Optional parameters for the query.
     * @return {Promise<any>} A promise that resolves to the result of the query execution.
     */
    public static async raw(query: string, params: any[] = []): Promise<any> {
        return this.entity.query(query, params)
    }
}
