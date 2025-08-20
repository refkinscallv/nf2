'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.1.0
 * @license MIT
 */
import { ObjectLiteral, SelectQueryBuilder, Repository } from 'typeorm'
import { PaginateParams, PaginateResult } from '@type/core'

/**
 * CorePaginate is a utility class for handling pagination of database queries.
 * It provides a static method to paginate results from a TypeORM repository.
 * It takes pagination parameters such as page number, limit, filter conditions, and relations to include in the query.
 */
export default class CorePaginate {
    /**
     * Static method to paginate results from a TypeORM repository.
     * It constructs a query based on the provided parameters and returns a PaginateResult object.
     * @param repo The TypeORM repository to paginate.
     * @param params The pagination parameters including page number, limit, filter conditions, and relations
     * @return {Promise<PaginateResult<T>>} A promise that resolves to a PaginateResult object containing the paginated data.
     */
    public static async make<T extends ObjectLiteral>(repo: Repository<T>, params: PaginateParams<T>): Promise<PaginateResult<T>> {
        const page = Math.max(1, Number(params.page) || 1)
        const limit = Math.max(1, Number(params.limit) || 10)
        const offset = (page - 1) * limit
        const filter = params.filter || {}
        const relations = (params.with || '')
            .split(',')
            .map((r) => r.trim())
            .filter(Boolean)

        let query: SelectQueryBuilder<T> = repo.createQueryBuilder('entity')

        for (const rel of relations) {
            query = query.leftJoinAndSelect(`entity.${rel}`, rel)
        }

        Object.entries(filter).forEach(([key, val], idx) => {
            if (!val) return

            const paramKey = `filter_${idx}`
            const path = key.includes('.') ? key : `entity.${key}`

            query = query.andWhere(`${path} LIKE :${paramKey}`, {
                [paramKey]: `%${val}%`,
            })
        })

        const total = await query.getCount()
        const data = await query.skip(offset).take(limit).getMany()

        return {
            page,
            limit,
            total,
            max_page: Math.ceil(total / limit),
            data,
            filter,
        }
    }
}
