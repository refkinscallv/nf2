'use strict'

import CoreCommon from '@core/common.core'
import { GeneralCorsConfig } from '@type/core'

export default class SocketConfig {
    public static cors: GeneralCorsConfig = {
        origin: CoreCommon.url('base'),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['X-Requested-With', 'X-Custom-Header', 'Content-Type', 'Authorization', 'Accept', 'Origin', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
        exposedHeaders: ['Content-Range', 'X-Content-Range', 'X-Custom-Header'],
        credentials: true,
        maxAge: 86400,
        preflightContinue: true,
        optionsSuccessStatus: 200,
    }
}
