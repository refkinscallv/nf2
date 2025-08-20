import { Express } from 'express'

export default class RegisterMiddleware {
    public static set(express: Express): void {
        express.set('trust proxy', true)
    }
}
