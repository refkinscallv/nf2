'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.1.0
 * @license MIT
 */
import { ObjectLiteral } from 'typeorm'
import { Request, Response, NextFunction } from 'express'

/**
 * Common URL types used in the application.
 */
export type CoreCommonUrl = 'base' | 'api' | 'static'

/**
 * Cookie options interface for managing cookies in the application.
 */
export interface CookieOptions {
    path: string
    maxAge: number
    secure: boolean
    httpOnly: boolean
}

/**
 * Type for a generic run seeder function.
 * It defines the structure for seeding data into the database.
 */
export type RunSeederType<T> = {
    entity: new () => T
    data: Partial<T>[]
}

/**
 * Paginate parameters interface for defining pagination options.
 * It includes options for page number, limit, filter, and relations.
 */
export interface PaginateParams<T extends ObjectLiteral> {
    page?: number
    limit?: number
    filter?: Partial<T>
    with?: string
}

/**
 * Paginate result interface for the result of a pagination operation.
 * It includes the current page, limit, total items, maximum pages, and the data itself.
 */
export interface PaginateResult<T> {
    limit: number
    page: number
    total: number
    max_page: number
    data: T[]
    filter: string[] | string | null | any
}

/**
 * Route middleware type definition.
 * It represents a function that takes a request, response, and next function.
 */
export type RouteMiddleware = (req: Request, res: Response, next: NextFunction) => void

/**
 * Route method type definition.
 * It defines the HTTP methods that can be used in routes.
 */
export type RouteMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options' | 'head' | 'all'

/**
 * HTTP context type definition.
 * It encapsulates the request, response, and next function for handling HTTP requests from express.
 */
export type HttpContext = {
    req: Request
    res: Response
    next: NextFunction
}

/**
 * Route handler type definition.
 * It can be a function that takes an HTTP context or a tuple representing a class and method or object and method.
 */
export type RouteHandler = ((ctx: HttpContext) => any) | [new () => any, string] | [any, string]

/**
 * Route definition interface.
 * It defines the structure of a route, including methods, path, handler, and optional middlewares.
 */
export interface RouteDefinition {
    methods: RouteMethod[]
    path: string
    handler: RouteHandler
    middlewares?: RouteMiddleware[]
}

/**
 * Type for a TypeORM repository.
 * It extends the TypeORM Repository interface with a generic type T.
 */
export type TypeOrmDialect = 'common' | 'mysql' | 'postgres' | 'sqlite' | 'mongodb' | 'oracle'

/**
 * Type for a Lifecycle hook.
 * It defines a function that can be used in the application lifecycle, such as before or after certain operations.
 */
export type HookType = 'before' | 'after' | 'shutdown'
export type Subsystem = 'system'
export type HookFn = () => void | Promise<void>

/**
 * Constructor type definition.
 * It represents a class constructor that can be instantiated with any number of arguments.
 */
export type Constructor<T = any> = new (...args: any[]) => T
