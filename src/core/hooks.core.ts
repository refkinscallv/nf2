'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.2.1
 * @license MIT
 */
import { HookFn, HookType, Subsystem } from '@type/core'
import Logger from '@core/logger.core'

export default class CoreHook {
    private static hooks: Record<Subsystem, Partial<Record<HookType, HookFn[]>>> = {
        system: {},
    }

    public static register(subsystem: Subsystem, type: HookType, fn: HookFn): void {
        if (!this.hooks[subsystem]) this.hooks[subsystem] = {}
        this.hooks[subsystem][type] ??= []
        this.hooks[subsystem][type]!.push(fn)
    }

    public static async init(subsystem: Subsystem, type: HookType): Promise<any> {
        const fns = this.hooks[subsystem]?.[type]
        if (!fns?.length) return

        for (const fn of fns) {
            try {
                await fn()
            } catch (err: any | unknown | Error) {
                Logger.info(`HOOK - Error in ${subsystem}:${type}: ${err?.message || JSON.stringify(err)}`)
                if (type !== 'shutdown') throw err
            }
        }
    }

    public static async shutdown(): Promise<void> {
        for (const subsystem of Object.keys(this.hooks) as Subsystem[]) {
            await this.init(subsystem, 'shutdown')
        }
    }
}
