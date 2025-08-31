'use strict'

import path from 'path'
import { GeneralCorsConfig, ExpressConfigStatic, ExpressConfigView } from '@type/core'

export default class ExpressConfig {
    public static cors: GeneralCorsConfig = {
        origin: (origin: unknown, callback: any) => callback(null, true),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD', 'CONNECT', 'TRACE'],
        allowedHeaders: ['X-Requested-With', 'X-Custom-Header', 'Content-Type', 'Authorization', 'Accept', 'Origin', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
        exposedHeaders: ['Content-Range', 'X-Content-Range', 'X-Custom-Header'],
        credentials: true,
        maxAge: 86400,
        preflightContinue: false,
        optionsSuccessStatus: 200,
    }

    public static static: ExpressConfigStatic = {
        route: '/static',
        path: path.join(__dirname, '../../../public/static'),
    }

    public static view: ExpressConfigView = {
        engine: 'ejs',
        path: path.join(__dirname, '../../../public/views'),
    }
}
