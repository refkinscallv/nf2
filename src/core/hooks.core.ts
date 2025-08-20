'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.1.0
 * @license MIT
 */
import { HookFn, HookType, Subsystem } from '@type/core'

/**
 * CoreHook is a utility class for managing application hooks.
 * It allows registering and executing hooks for different subsystems and types.
 * Hooks can be used for various purposes, such as initialization, shutdown, or custom events.
 */
export default class CoreHook {
    /**
     * A record to store hooks for different subsystems and types.
     * Each subsystem can have multiple hook types, each containing an array of functions.
     */
    private static hooks: Record<Subsystem, Partial<Record<HookType, HookFn[]>>> = {
        system: {},
    }

    /**
     * Registers a hook function for a specific subsystem and type.
     * If the subsystem or type does not exist, it will be created.
     * @param subsystem The subsystem to register the hook for.
     * @param type The type of the hook (e.g., 'before', 'after', 'shutdown').
     * @param fn The hook function to register.
     * @return {void} This method does not return a value.
     */
    public static register(subsystem: Subsystem, type: HookType, fn: HookFn) {
        if (!this.hooks[subsystem]) this.hooks[subsystem] = {}
        this.hooks[subsystem][type] ??= []
        this.hooks[subsystem][type]!.push(fn)
    }

    /**
     * Initializes the hooks for a specific subsystem and type.
     * It executes all registered hook functions in order.
     * If an error occurs during execution, it logs the error and throws it if the type is not 'shutdown'.
     * @param subsystem The subsystem to initialize hooks for.
     * @param type The type of hooks to execute (e.g., 'before', 'after', 'shutdown').
     * @return {Promise<void>} A promise that resolves when all hooks have been executed.
     * @throws {Error} If an error occurs during hook execution, it will be thrown unless the type is 'shutdown'.
     */
    public static async init(subsystem: Subsystem, type: HookType) {
        const fns = this.hooks[subsystem]?.[type]
        if (!fns?.length) return

        for (const fn of fns) {
            try {
                await fn()
            } catch (err) {
                console.error(`[HOOK] Error in ${subsystem}:${type}`, err)
                if (type !== 'shutdown') throw err
            }
        }
    }

    /**
     * Shuts down the hooks for all subsystems.
     * It executes all registered shutdown hooks in order.
     * This method is typically called when the application is terminating.
     * @return {Promise<void>} A promise that resolves when all shutdown hooks have been executed.
     */
    public static async shutdown() {
        for (const subsystem of Object.keys(this.hooks) as Subsystem[]) {
            await this.init(subsystem, 'shutdown')
        }
    }
}
