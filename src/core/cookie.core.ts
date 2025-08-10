'use strict';

import { Request, Response } from 'express';
import crypto from 'crypto';
import CoreCommon from '@core/common.core';
import { CookieOptions } from '@type/core';

export default class CoreCookie {
    private static req: Request | null = null;
    private static res: Response | null = null;
    private static cache: Record<string, any> | null = null;

    private static readonly cookieName = CoreCommon.env('COOKIE_NAME', 'node_framework_cookie');
    private static readonly secret = CoreCommon.env('COOKIE_SECRET', 'default_cookie_secret');

    public static init(req: Request, res: Response) {
        this.req = req;
        this.res = res;
        this.cache = null;
    }

    public static all<T = Record<string, any>>(): T | null {
        return this.#readCookie() as T | null;
    }

    public static get<T = any>(keys: string | string[]): T | undefined {
        const full = this.#readCookie();
        if (!full) return undefined;

        if (Array.isArray(keys)) {
            return keys.reduce(
                (result, key) => {
                    if (key in full) result[key] = full[key];
                    return result;
                },
                {} as Record<string, any>,
            ) as T;
        }

        return full[keys];
    }

    public static set(key: string | Record<string, any>, value?: any, options: Partial<CookieOptions> = {}): boolean {
        if (!this.res) return false;

        const current = this.#readCookie() || {};

        if (typeof key === 'string') {
            current[key] = value;
        } else {
            Object.assign(current, key);
        }

        return this.#writeCookie(current, options);
    }

    public static remove(keys: string | string[], options: Partial<CookieOptions> = {}): boolean {
        if (!this.res) return false;

        const current = this.#readCookie() || {};

        (Array.isArray(keys) ? keys : [keys]).forEach((k) => {
            delete current[k];
            this.cache && delete this.cache[k];
        });

        return this.#writeCookie(current, options);
    }

    public static clear(): boolean {
        if (!this.res) return false;
        this.res.clearCookie(this.cookieName);
        this.cache = null;
        return true;
    }

    static #readCookie(): Record<string, any> | null {
        if (this.cache) return this.cache;
        if (!this.req) return null;

        try {
            const raw = this.req.cookies?.[this.cookieName];
            if (!raw) return null;

            const decrypted = this.#decrypt(raw);
            return (this.cache = JSON.parse(decrypted));
        } catch {
            return null;
        }
    }

    static #writeCookie(data: Record<string, any>, options: Partial<CookieOptions> = {}): boolean {
        if (!this.res) return false;

        try {
            const encrypted = this.#encrypt(JSON.stringify(data));
            const config: CookieOptions = {
                path: CoreCommon.env('COOKIE_PATH', '/'),
                maxAge: Number(CoreCommon.env('COOKIE_EXPIRE', '86400')) * 1000,
                secure: CoreCommon.env('COOKIE_SECURE', 'false') === 'true',
                httpOnly: CoreCommon.env('COOKIE_HTTP_ONLY', 'true') === 'true',
                ...options,
            };

            this.res.cookie(this.cookieName, encrypted, config);
            this.cache = data;
            return true;
        } catch {
            return false;
        }
    }

    static #encrypt(plain: string): string {
        const iv = crypto.randomBytes(16);
        const key = crypto.createHash('sha256').update(this.secret).digest();
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
        return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    }

    static #decrypt(enc: string): string {
        const [ivHex, dataHex] = enc.split(':');
        if (!ivHex || !dataHex) throw new Error('Invalid cookie format');

        const iv = Buffer.from(ivHex, 'hex');
        const encrypted = Buffer.from(dataHex, 'hex');
        const key = crypto.createHash('sha256').update(this.secret).digest();
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString('utf8');
    }
}
