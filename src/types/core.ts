import { ObjectLiteral } from 'typeorm';
import { Request, Response, NextFunction } from 'express';

export type CoreCommonUrl = 'base' | 'api' | 'static';

export interface CookieOptions {
    path: string;
    maxAge: number;
    secure: boolean;
    httpOnly: boolean;
}

export type RunSeederType<T> = {
    entity: new () => T;
    data: Partial<T>[];
};

export interface PaginateParams<T extends ObjectLiteral> {
    page?: number;
    limit?: number;
    filter?: Partial<T>;
    with?: string;
}

export interface PaginateResult<T> {
    limit: number;
    page: number;
    total: number;
    max_page: number;
    data: T[];
    filter: string[] | string | null | any;
}

/**
 * Middleware function type for Express routes.
 */
export type RouteMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => void;

/**
 * HTTP methods supported by the routing system.
 */
export type RouteMethod =
    | 'get'
    | 'post'
    | 'put'
    | 'patch'
    | 'delete'
    | 'options'
    | 'head'
    | 'all';

/**
 * HTTP context passed to route handlers.
 */
export type HttpContext = {
    req: Request;
    res: Response;
    next: NextFunction;
};

/**
 * Route handler can be a function or a [Controller, method] tuple.
 */
export type RouteHandler =
    | ((ctx: HttpContext) => any)
    | [new () => any, string]
    | [any, string];

/**
 * Route definition interface.
 */
export interface RouteDefinition {
    methods: RouteMethod[];
    path: string;
    handler: RouteHandler;
    middlewares?: RouteMiddleware[];
}

export type TypeOrmDialect =
    | 'common'
    | 'mysql'
    | 'postgres'
    | 'sqlite'
    | 'mongodb'
    | 'oracle';

export type HookType = 'before' | 'after' | 'shutdown';
export type Subsystem = 'system';
export type HookFn = () => void | Promise<void>;

export type Constructor<T = any> = new (...args: any[]) => T;
