'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.2.1
 * @license MIT
 */
import express, { Express as TExpress, Router, Response } from 'express'
import cookieParser from 'cookie-parser'
import ExpressConfig from '@app/config/express.config'
import CoreCookie from '@core/cookie.core'
import cors from 'cors'
import RegisterMiddleware from '@app/http/middlewares/register.middleware'
import CoreRoute from '@core/route.core'
import qs from 'qs'
import Logger from '@core/logger.core'

export default class CoreExpress {
    public static express: TExpress = express()
    private static router: Router = express.Router()

    public static async init(): Promise<void | Error> {
        try {
            await this.middlewares()
            await this.routes()
            Logger.info('EXPRESS - Application initialized successfully')
        } catch (err) {
            Logger.error('EXPRESS - Failed to initialize application', err as Error)
            throw err
        }
    }

    private static async middlewares(): Promise<void | Error> {
        try {
            this.express.set('query parser', (str: string) => qs.parse(str))
            this.express.use(express.json())
            this.express.use(express.urlencoded({ extended: true }))
            this.express.use(cookieParser())
            this.express.use(cors(ExpressConfig.cors))
            this.express.use((req, res, next) => {
                CoreCookie.init(req, res)
                next()
            })
            this.express.use(ExpressConfig.static.route, express.static(ExpressConfig.static.path))
            await RegisterMiddleware.set(this.express)
            Logger.info('EXPRESS - Middlewares registered successfully')
        } catch (err) {
            Logger.error('EXPRESS - Failed to register middlewares', err as Error)
            throw err
        }
    }

    private static async routes(): Promise<void | Error> {
        try {
            await import('@app/routes/register.route')
            CoreRoute.apply(this.router)
            this.express.use(this.router)
            Logger.info('EXPRESS - Routes registered successfully')
        } catch (err) {
            Logger.error('EXPRESS - Failed to register routes', err as Error)
            throw err
        }
    }

    public static json(
        res: Response,
        arg1:
            | boolean
            | {
                  status: boolean
                  code: number
                  message: string
                  result: Record<string, any> | null
                  custom?: Record<string, any>
              }
            | any,
        arg2?: number,
        arg3?: string,
        arg4?: Record<string, any> | any[] | null,
        arg5?: Partial<Record<string, any>>,
    ): Response {
        const response =
            typeof arg1 === 'object'
                ? { ...arg1, ...arg1.custom }
                : {
                      status: arg1,
                      code: arg2!,
                      message: arg3!,
                      result: arg4!,
                      ...arg5,
                  }

        return res.status(response.code).json(response)
    }

    public static redirect(res: Response, url: string, statusCode: number = 302): Response {
        return res.redirect(statusCode, url) as unknown as Response
    }
}
