'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.1.0
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

/**
 * CoreExpress class provides methods to initialize and manage the Express application.
 * It sets up middlewares, routes, and provides utility methods for JSON responses and redirects.
 * It also integrates with CoreCookie for cookie management.
 */
export default class CoreExpress {
    /**
     * The main Express application instance.
     */
    public static express: TExpress = express()
    /**
     * The router instance used for defining routes.
     */
    private static router: Router = express.Router()

    /**
     * Initializes the Express application by setting up middlewares and routes.
     * This method should be called to prepare the application for handling requests.
     * @returns {Promise<void>} A promise that resolves when the initialization is complete.
     */
    public static async init() {
        this.middlewares()
        this.routes()
    }

    /**
     * Sets up the middlewares for the Express application.
     * It includes body parsing, cookie handling, CORS, and static file serving.
     * It also registers global and group middlewares.
     * @return {Promise<void>} A promise that resolves when the middlewares are set up.
     */
    private static async middlewares() {
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
        RegisterMiddleware.set(this.express)
    }

    /**
     * Applies the defined routes to the Express application.
     * It imports route definitions and applies them to the router.
     * This method should be called after middlewares are set up.
     * @return {Promise<void>} A promise that resolves when the routes are applied.
     */
    private static async routes() {
        await import('@app/routes/register.route')
        CoreRoute.apply(this.router)
        this.express.use(this.router)
    }

    /**
     * Sends a JSON response with the specified parameters.
     * It can handle both success and error responses, including custom data.
     * @param res The Express response object.
     * @param arg1 A boolean indicating success or an object containing response data.
     * @param arg2 The HTTP status code (optional).
     * @param arg3 A message string (optional).
     * @param arg4 The result data (optional).
     * @param arg5 Additional custom data (optional).
     * @return {Response} The Express response object with the JSON data.
     */
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

    /**
     * Redirects the response to a specified URL with an optional status code.
     * @param res The Express response object.
     * @param url The URL to redirect to.
     * @param statusCode The HTTP status code for the redirect (default is 302).
     * @return {Response} The Express response object with the redirect.
     */
    public static redirect(res: Response, url: string, statusCode: number = 302): Response {
        return res.redirect(statusCode, url) as unknown as Response
    }
}
