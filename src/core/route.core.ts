'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.2.1
 * @license MIT
 */
import { Router, Request, Response, NextFunction } from 'express'
import { HttpContext, RouteMethod, RouteHandler, RouteDefinition, RouteMiddleware } from '@type/core'
import Logger from '@core/logger.core'

export default class CoreRoute {
    private static routes: RouteDefinition[] = []
    private static prefix = ''
    private static groupMiddlewares: RouteMiddleware[] = []
    private static globalMiddlewares: RouteMiddleware[] = []

    private static normalizePath(path: string): string {
        return '/' + path.split('/').filter(Boolean).join('/')
    }

    private static allMethods: RouteMethod[] = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head']

    public static add(methods: RouteMethod | RouteMethod[], path: string, handler: RouteHandler, middlewares: RouteMiddleware[] = []): void {
        const methodArray = Array.isArray(methods) ? methods : [methods]
        const fullPath = this.normalizePath(`${this.prefix}/${path}`)

        this.routes.push({
            methods: methodArray,
            path: fullPath,
            handler,
            middlewares: [...this.globalMiddlewares, ...this.groupMiddlewares, ...middlewares],
        })
    }

    public static get(path: string, handler: RouteHandler, middlewares: RouteMiddleware[] = []): void {
        this.add('get', path, handler, middlewares)
    }
    public static post(path: string, handler: RouteHandler, middlewares: RouteMiddleware[] = []): void {
        this.add('post', path, handler, middlewares)
    }
    public static put(path: string, handler: RouteHandler, middlewares: RouteMiddleware[] = []): void {
        this.add('put', path, handler, middlewares)
    }
    public static delete(path: string, handler: RouteHandler, middlewares: RouteMiddleware[] = []): void {
        this.add('delete', path, handler, middlewares)
    }
    public static patch(path: string, handler: RouteHandler, middlewares: RouteMiddleware[] = []): void {
        this.add('patch', path, handler, middlewares)
    }
    public static options(path: string, handler: RouteHandler, middlewares: RouteMiddleware[] = []): void {
        this.add('options', path, handler, middlewares)
    }
    public static head(path: string, handler: RouteHandler, middlewares: RouteMiddleware[] = []): void {
        this.add('head', path, handler, middlewares)
    }

    public static group(prefix: string, callback: () => void, middlewares: RouteMiddleware[] = []): void {
        const prevPrefix = this.prefix
        const prevGroup = this.groupMiddlewares

        this.prefix = this.normalizePath([prevPrefix, prefix].filter(Boolean).join('/'))
        this.groupMiddlewares = [...prevGroup, ...middlewares]
        callback()

        this.prefix = prevPrefix
        this.groupMiddlewares = prevGroup
    }

    public static middleware(middlewares: RouteMiddleware[], callback: () => void): void {
        const prevGlobal = this.globalMiddlewares
        this.globalMiddlewares = [...prevGlobal, ...middlewares]
        callback()
        this.globalMiddlewares = prevGlobal
    }

    private static resolveHandler(handler: RouteHandler): ((ctx: HttpContext) => Promise<void> | void) | undefined {
        if (typeof handler === 'function') return handler

        if (Array.isArray(handler) && handler.length === 2) {
            const [Controller, method] = handler

            if (typeof Controller === 'function' && typeof Controller[method] === 'function') {
                return Controller[method].bind(Controller)
            }

            if (typeof Controller === 'function') {
                const instance = new Controller()
                if (typeof instance[method] === 'function') {
                    return instance[method].bind(instance)
                }
            }
        }

        return undefined
    }

    public static async apply(router: Router): Promise<void> {
        for (const route of this.routes) {
            const handlerFn = this.resolveHandler(route.handler)

            if (!handlerFn) {
                Logger.error(`ROUTES - Invalid handler for route ${route.path}`)
                continue
            }

            for (const method of route.methods) {
                if (!this.allMethods.includes(method)) {
                    Logger.error(`ROUTES - Invalid method '${method}' for route ${route.path}`)
                    continue
                }

                router[method](route.path, ...(route.middlewares || []), async (req: Request, res: Response, next: NextFunction) => {
                    try {
                        const ctx: HttpContext = { req, res, next }
                        const result = handlerFn(ctx)
                        if (result instanceof Promise) await result
                    } catch (err: any) {
                        Logger.error(`ROUTES - Invalid method '${method}' for route ${route.path}`)
                        next(err)
                    }
                })
            }
        }
    }
}
