'use strict'

import { createLogger, format, transports, Logger as WinstonLogger } from 'winston'
import CoreCommon from '@core/common.core'
import path from 'path'

export default class Logger {
    public static logger: WinstonLogger

    public static init(): void {
        const isDebug = CoreCommon.env<string>('APP_DEBUG', 'off') === 'on'

        const fileFormat = format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(({ timestamp, level, message }) => `[NF2] ${timestamp} [${level}] : ${message}`),
        )

        const consoleFormat = format.combine(
            format.colorize({ all: true }),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(({ timestamp, level, message }) => `[NF2] ${timestamp} [${level}] : ${message}`),
        )

        this.logger = createLogger({
            level: isDebug ? 'debug' : 'info',
            transports: [
                new transports.File({
                    filename: path.join(__dirname, '../../logs/error.log'),
                    level: 'error',
                    format: fileFormat,
                }),
                new transports.File({
                    filename: path.join(__dirname, '../../logs/all.log'),
                    format: fileFormat,
                }),
                new transports.Console({
                    level: 'info',
                    format: consoleFormat,
                }),
            ],
        })
    }

    public static error(...args: unknown[]): void {
        const [message, err] = args
        let logMessage = String(message)
        if (err instanceof Error) {
            logMessage += ` | ${err.stack}`
        } else if (typeof err === 'string') {
            logMessage += ` | ${err}`
        } else if (err) {
            try {
                logMessage += ` | ${JSON.stringify(err)}`
            } catch {
                logMessage += ` | [Unknown Error]`
            }
        }
        this.logger.error(logMessage)
    }

    public static warn(...messages: unknown[]): void {
        this.logger.warn(messages.map((m) => (typeof m === 'string' ? m : JSON.stringify(m))).join(' | '))
    }

    public static info(...messages: unknown[]): void {
        this.logger.info(messages.map((m) => (typeof m === 'string' ? m : JSON.stringify(m))).join(' | '))
    }

    public static http(message: string): void {
        this.logger.http(message)
    }

    public static verbose(message: string): void {
        this.logger.verbose(message)
    }

    public static debug(message: string): void {
        this.logger.debug(message)
    }

    public static silly(message: string): void {
        this.logger.silly(message)
    }

    public static log(level: string, message: string): void {
        this.logger.log(level, message)
    }
}
