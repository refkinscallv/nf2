'use strict';

import { HookFn, HookType, Subsystem } from '@type/core';

export default class CoreHook {
    private static hooks: Record<Subsystem, Partial<Record<HookType, HookFn[]>>> = {
        system: {},
    };

    public static register(subsystem: Subsystem, type: HookType, fn: HookFn) {
        if (!this.hooks[subsystem]) this.hooks[subsystem] = {};
        this.hooks[subsystem][type] ??= [];
        this.hooks[subsystem][type]!.push(fn);
    }

    public static async init(subsystem: Subsystem, type: HookType) {
        const fns = this.hooks[subsystem]?.[type];
        if (!fns?.length) return;

        for (const fn of fns) {
            try {
                await fn();
            } catch (err) {
                console.error(`[HOOK] Error in ${subsystem}:${type}`, err);
                if (type !== 'shutdown') throw err;
            }
        }
    }

    public static async shutdown() {
        for (const subsystem of Object.keys(this.hooks) as Subsystem[]) {
            await this.init(subsystem, 'shutdown');
        }
    }
}
