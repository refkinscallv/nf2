'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.2.1
 * @license MIT
 */
import { ObjectLiteral, SelectQueryBuilder, Repository } from 'typeorm'
import { PaginateParams, PaginateResult } from '@type/core'

export default class CorePaginate {
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
