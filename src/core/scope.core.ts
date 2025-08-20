'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.1.0
 * @license MIT
 */
import CoreCommon from '@core/common.core'
import CoreHook from '@core/hooks.core'

process.env.TZ = CoreCommon.env<string>('APP_TIMEZONE', 'UTC')

const isDev = (): boolean => {
    return ['development', 'develop', 'dev'].includes(CoreCommon.env<string>('APP_ENV', 'production').toLowerCase())
}

const suppressLog =
    (original: (...args: any[]) => void) =>
    (...args: any[]) => {
        if (isDev()) original(...args)
    }

console.error = suppressLog(console.error)
console.warn = suppressLog(console.warn)

process.on('unhandledRejection', (reason) => {
    console.error('[SCOPE] Unhandled Rejection:', reason)
})

process.on('uncaughtException', (err: Error) => {
    console.error('[SCOPE] Uncaught Exception:', err.stack || err.message)
    process.exit(1)
})

process.on('warning', (warning) => {
    console.warn('[SCOPE] Process Warning:', warning)
})

process.on('rejectionHandled', (promise) => {
    console.error('[SCOPE] Late Rejection Handled:', promise)
})

process.on('SIGINT', async () => {
    try {
        await CoreHook.shutdown()
    } catch (e) {
        console.error('[SCOPE] Shutdown Hook Error:', e)
    } finally {
        console.log('[SCOPE] Process terminated (SIGINT)')
        process.exit(0)
    }
})

process.on('SIGTERM', () => {
    console.log('[SCOPE] Process terminated (SIGTERM)')
    process.exit(0)
})

process.on('beforeExit', (code) => {
    console.log('[SCOPE] Before Exit with code:', code)
})

process.on('exit', (code) => {
    console.log('[SCOPE] Process exited with code:', code)
})
