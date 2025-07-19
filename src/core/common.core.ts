'use strict';

import 'dotenv/config';
import { createHash } from 'crypto';
import { CoreCommonUrl } from '@type/core';
import { resolve } from 'path';

export default class CoreCommon {
    public static env<T = any>(key: string, defaultVal: any | null = null): T {
        return (process.env[key] ?? defaultVal) as T;
    }

    public static url(base: CoreCommonUrl = 'base', path: string = ''): string {
        const baseUrls: Record<CoreCommonUrl, string> = {
            base: CoreCommon.env<string>('APP_URL', 'http://localhost:3000'),
            api:
                CoreCommon.env<string>('APP_URL', 'http://localhost:3000') +
                '/api',
            static:
                CoreCommon.env<string>('APP_URL', 'http://localhost:3000') +
                '/static',
        };

        const cleanBase = baseUrls[base].replace(/\/+$/, '');
        const cleanPath = path.replace(/^\/+/, '').replace(/\/+$/, '');

        return cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase;
    }

    public static path(...paths: string[]): string {
        const root = process.cwd();
        const cleanPaths = paths.map((p) => p.replace(/^\/+|\/+$/g, ''));
        return resolve(root, ...cleanPaths);
    }

    public static extractUrl(
        fullUrl: string,
        get: Exclude<keyof URL, 'toJSON'>,
    ): string | URL[keyof URL] {
        try {
            const url = new URL(fullUrl);
            return url[get];
        } catch {
            return fullUrl;
        }
    }

    public static json(
        status = true,
        code = 200,
        message = '',
        result: Record<string, any> | any[] | null = {},
        custom: Partial<Record<string, any>> = {},
    ) {
        return { status, code, message, result, ...custom };
    }

    public static async handler<T>(
        callback: () => Promise<T>,
        shouldThrow?: (err: any) => T | Promise<T> | void,
    ): Promise<T> {
        try {
            return await callback();
        } catch (err) {
            if (shouldThrow) {
                const result = await shouldThrow(err);
                if (result !== undefined) return result;
            }
            throw err;
        }
    }

    public static md5(input: string): string {
        return createHash('md5').update(input).digest('hex');
    }

    public static uniqid(prefix = '', moreEntropy = false): string {
        const now = Date.now().toString(16);
        const random = Math.floor(Math.random() * 0xfffff).toString(16);
        const entropy = moreEntropy
            ? '.' + process.hrtime.bigint().toString(36)
            : '';
        return `${prefix}${now}${random}${entropy}`;
    }

    public static sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    public static isEmpty(val: any): boolean {
        if (typeof val === 'undefined') return true;
        if (val == null) return true;
        if (typeof val === 'string' || Array.isArray(val))
            return val.length === 0;
        if (typeof val === 'object') return Object.keys(val).length === 0;
        return false;
    }

    public static capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    public static toBool(val: any): boolean {
        if (typeof val === 'boolean') return val;
        if (typeof val === 'string')
            return ['true', '1', 'yes', 'on'].includes(val.toLowerCase());
        return Boolean(val);
    }

    public static camelCase(str: string): string {
        return str.replace(/[_-](\w)/g, (_, c) => c.toUpperCase());
    }

    public static snakeCase(str: string): string {
        return str
            .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
            .replace(/^_/, '');
    }

    public static className(instance: any): string {
        return instance?.constructor?.name ?? '';
    }

    public static strLimit(str: string, limit = 100, end = '...'): string {
        return str.length > limit ? str.slice(0, limit) + end : str;
    }

    public static strContains(str: string, search: string): boolean {
        return str.includes(search);
    }

    public static startsWith(str: string, prefix: string): boolean {
        return str.startsWith(prefix);
    }

    public static endsWith(str: string, suffix: string): boolean {
        return str.endsWith(suffix);
    }
}
