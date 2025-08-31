'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.2.1
 * @license MIT
 */
import CoreCommon from '@core/common.core'
import CoreHook from '@core/hooks.core'
import Logger from '@core/logger.core'

// Set timezone
process.env.TZ = CoreCommon.env<string>('APP_TIMEZONE', 'UTC')

// Initialize logger
Logger.init()

// Determine if environment is development
const isDev = (): boolean => {
    return ['development', 'develop', 'dev'].includes(CoreCommon.env<string>('APP_ENV', 'production').toLowerCase())
}

// Suppress console logs in non-dev environments
const suppressLog =
    (original: (...args: any[]) => void, level: 'info' | 'error' | 'warn' = 'info') =>
    (...args: unknown[]): void => {
        if (isDev()) {
            original(...args)
        } else {
            switch (level) {
                case 'info':
                    Logger.info(...args)
                    break
                case 'warn':
                    Logger.warn(...args)
                    break
                case 'error':
                    Logger.error(...args)
                    break
            }
        }
    }

// Override console functions to integrate with Logger
console.error = suppressLog(console.error, 'error')
console.warn = suppressLog(console.warn, 'warn')
console.log = suppressLog(console.log, 'info')

// Global unhandled promise rejection handler
process.on('unhandledRejection', (reason: unknown) => {
    if (reason instanceof Error) {
        Logger.error('[SCOPE] Unhandled Rejection:', reason)
    } else {
        Logger.error('[SCOPE] Unhandled Rejection (unknown):', JSON.stringify(reason))
    }
})

// Global uncaught exception handler
process.on('uncaughtException', (err: unknown) => {
    if (err instanceof Error) {
        Logger.error('[SCOPE] Uncaught Exception:', err.stack || err.message)
    } else {
        Logger.error('[SCOPE] Uncaught Exception (unknown):', JSON.stringify(err))
    }
    process.exit(1)
})

// Global process warning handler
process.on('warning', (warning: unknown) => {
    if (warning instanceof Error) {
        Logger.warn('[SCOPE] Process Warning:', warning.stack || warning.message)
    } else {
        Logger.warn('[SCOPE] Process Warning (unknown):', JSON.stringify(warning))
    }
})

// Handler for late promise rejections
process.on('rejectionHandled', (promise: unknown) => {
    Logger.error('[SCOPE] Late Rejection Handled:', JSON.stringify(promise))
})

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
    try {
        Logger.info('[SCOPE] SIGINT received. Running shutdown hooks...')
        await CoreHook.shutdown()
    } catch (e: unknown) {
        if (e instanceof Error) {
            Logger.error('[SCOPE] Shutdown Hook Error:', e.stack || e.message)
        } else {
            Logger.error('[SCOPE] Shutdown Hook Error (unknown):', JSON.stringify(e))
        }
    } finally {
        Logger.info('[SCOPE] Process terminated (SIGINT)')
        process.exit(0)
    }
})

// Graceful shutdown on SIGTERM
process.on('SIGTERM', () => {
    Logger.info('[SCOPE] Process terminated (SIGTERM)')
    process.exit(0)
})

// Triggered before Node.js exits naturally
process.on('beforeExit', (code) => {
    Logger.info('[SCOPE] Before Exit with code:', code)
})

// Triggered after Node.js exits
process.on('exit', (code) => {
    Logger.info('[SCOPE] Process exited with code:', code)
})
