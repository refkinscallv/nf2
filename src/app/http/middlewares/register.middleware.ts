import { Express } from 'express'
import ExpressConfig from '@app/config/express.config'
import Logger from '@core/logger.core'

export default class RegisterMiddleware {
    public static async set(express: Express): Promise<void> {
        try {
            express.set('trust proxy', true)
            express.set('view engine', ExpressConfig.view.engine)
            express.set('views', ExpressConfig.view.path)

            Logger.info('MIDDLEWARE - Express middleware registered successfully')
        } catch (err) {
            if (err instanceof Error) {
                Logger.error(`MIDDLEWARE - Failed to register Express middleware: ${err.message}`, err)
            } else {
                Logger.error('MIDDLEWARE - Failed to register Express middleware: Unknown error', new Error(String(err)))
            }
            throw err
        }
    }
}
