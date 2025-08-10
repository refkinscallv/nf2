'use strict';

import express, { Express as TExpress, Router, Response } from 'express';
import cookieParser from 'cookie-parser';
import ExpressConfig from '@app/config/express.config';
import CoreCookie from '@core/cookie.core';
import cors from 'cors';
import RegisterMiddleware from '@app/http/middlewares/register.middleware';
import CoreRoute from '@core/route.core';
import qs from 'qs';

export default class CoreExpress {
    public static express: TExpress = express();
    private static router: Router = express.Router();

    public static async init() {
        this.middlewares();
        this.routes();
    }

    private static async middlewares() {
        this.express.set('query parser', (str: string) => qs.parse(str));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(cookieParser());
        this.express.use(cors(ExpressConfig.cors));
        this.express.use((req, res, next) => {
            CoreCookie.init(req, res);
            next();
        });
        this.express.use(ExpressConfig.static.route, express.static(ExpressConfig.static.path));
        RegisterMiddleware.set(this.express);
    }

    private static async routes() {
        await import('@app/routes/register.route');
        CoreRoute.apply(this.router);
        this.express.use(this.router);
    }

    public static json(
        res: Response,
        arg1:
            | boolean
            | {
                  status: boolean;
                  code: number;
                  message: string;
                  result: Record<string, any> | null;
                  custom?: Record<string, any>;
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
                  };

        return res.status(response.code).json(response);
    }

    public static redirect(res: Response, url: string, statusCode: number = 302): Response {
        return res.redirect(statusCode, url) as unknown as Response;
    }
}
