'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.1.0
 * @license MIT
 */
import { Request, Response } from 'express'
import crypto from 'crypto'
import CoreCommon from '@core/common.core'
import { CookieOptions } from '@type/core'

/**
 * CoreCookie provides a simple interface for managing cookies in an Express.js application.
 * It supports reading, writing, and deleting cookies with encryption for security.
 * It uses AES-256-CBC for encryption and decryption, ensuring that cookie data is secure.
 * The cookie name and secret can be configured via environment variables.
 */
export default class CoreCookie {
    /**
     * The request object used to read cookies.
     */
    private static req: Request | null = null
    /**
     * The response object used to write cookies.
     */
    private static res: Response | null = null
    /**
     * Cache for cookie data to avoid repeated reads from the request.
     */
    private static cache: Record<string, any> | null = null

    /**
     * The name of the cookie used to store data.
     */
    private static readonly cookieName = CoreCommon.env('COOKIE_NAME', 'node_framework_cookie')
    /**
     * The secret used for encrypting and decrypting cookie data.
     * It should be kept secure and not exposed in the source code.
     */
    private static readonly secret = CoreCommon.env('COOKIE_SECRET', 'default_cookie_secret')

    /**
     * Initializes the cookie management system with the current request and response objects.
     * This should be called at the beginning of each request to set up the context for cookie operations.
     * @param req The Express request object.
     * @param res The Express response object.
     * @return void
     */
    public static init(req: Request, res: Response) {
        this.req = req
        this.res = res
        this.cache = null
    }

    /**
     * Retrieves all cookies as an object.
     * If no cookies are set, it returns null.
     * @return An object containing all cookies or null if no cookies are set.
     */
    public static all<T = Record<string, any>>(): T | null {
        return this.#readCookie() as T | null
    }

    /**
     * Retrieves a specific cookie by key or multiple cookies by an array of keys.
     * If the cookie does not exist, it returns undefined.
     * @param keys A single key or an array of keys to retrieve cookies.
     * @return The value of the cookie(s) or undefined if not found.
     */
    public static get<T = any>(keys: string | string[]): T | undefined {
        const full = this.#readCookie()
        if (!full) return undefined

        if (Array.isArray(keys)) {
            return keys.reduce(
                (result, key) => {
                    if (key in full) result[key] = full[key]
                    return result
                },
                {} as Record<string, any>,
            ) as T
        }

        return full[keys]
    }

    /**
     * Sets a cookie with the specified key and value.
     * If the key is an object, it sets multiple cookies at once.
     * It also supports options for cookie attributes like maxAge, secure, etc.
     * @param key The key of the cookie or an object containing multiple cookies.
     * @param value The value of the cookie (optional if key is an object).
     * @param options Additional options for the cookie.
     * @return True if the cookie was set successfully, false otherwise.
     */
    public static set(key: string | Record<string, any>, value?: any, options: Partial<CookieOptions> = {}): boolean {
        if (!this.res) return false

        const current = this.#readCookie() || {}

        if (typeof key === 'string') {
            current[key] = value
        } else {
            Object.assign(current, key)
        }

        return this.#writeCookie(current, options)
    }

    /**
     * Removes a cookie or multiple cookies by key(s).
     * If the key is an array, it removes all specified cookies.
     * @param keys A single key or an array of keys to remove cookies.
     * @param options Additional options for cookie removal.
     * @return True if the cookies were removed successfully, false otherwise.
     */
    public static remove(keys: string | string[], options: Partial<CookieOptions> = {}): boolean {
        if (!this.res) return false

        const current = this.#readCookie() || {}

        ;(Array.isArray(keys) ? keys : [keys]).forEach((k) => {
            delete current[k]
            this.cache && delete this.cache[k]
        })

        return this.#writeCookie(current, options)
    }

    /**
     * Clears all cookies by setting an empty cookie.
     * This effectively removes all cookies from the response.
     * @return True if the cookies were cleared successfully, false otherwise.
     */
    public static clear(): boolean {
        if (!this.res) return false
        this.res.clearCookie(this.cookieName)
        this.cache = null
        return true
    }

    /**
     * Reads the cookie data from the request, decrypts it, and returns it as an object.
     * If the cookie does not exist or cannot be decrypted, it returns null.
     * @return The decrypted cookie data or null if not found.
     */
    static #readCookie(): Record<string, any> | null {
        if (this.cache) return this.cache
        if (!this.req) return null

        try {
            const raw = this.req.cookies?.[this.cookieName]
            if (!raw) return null

            const decrypted = this.#decrypt(raw)
            return (this.cache = JSON.parse(decrypted))
        } catch {
            return null
        }
    }

    /**
     * Writes the cookie data to the response, encrypting it before sending.
     * It uses the specified options for cookie attributes like path, maxAge, etc.
     * @param data The data to store in the cookie.
     * @param options Additional options for the cookie.
     * @return True if the cookie was written successfully, false otherwise.
     */
    static #writeCookie(data: Record<string, any>, options: Partial<CookieOptions> = {}): boolean {
        if (!this.res) return false

        try {
            const encrypted = this.#encrypt(JSON.stringify(data))
            const config: CookieOptions = {
                path: CoreCommon.env('COOKIE_PATH', '/'),
                maxAge: Number(CoreCommon.env('COOKIE_EXPIRE', '86400')) * 1000,
                secure: CoreCommon.env('COOKIE_SECURE', 'false') === 'true',
                httpOnly: CoreCommon.env('COOKIE_HTTP_ONLY', 'true') === 'true',
                ...options,
            }

            this.res.cookie(this.cookieName, encrypted, config)
            this.cache = data
            return true
        } catch {
            return false
        }
    }

    /**
     * Encrypts a string using AES-256-CBC encryption.
     * It generates a random initialization vector (IV) for security.
     * @param plain The string to encrypt.
     * @return The encrypted string in the format "iv:encryptedData".
     */
    static #encrypt(plain: string): string {
        const iv = crypto.randomBytes(16)
        const key = crypto.createHash('sha256').update(this.secret).digest()
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
        const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
        return `${iv.toString('hex')}:${encrypted.toString('hex')}`
    }

    /**
     * Decrypts an encrypted string using AES-256-CBC decryption.
     * It expects the string to be in the format "iv:encryptedData".
     * @param enc The encrypted string to decrypt.
     * @return The decrypted string.
     * @throws Error if the format is invalid or decryption fails.
     */
    static #decrypt(enc: string): string {
        const [ivHex, dataHex] = enc.split(':')
        if (!ivHex || !dataHex) throw new Error('Invalid cookie format')

        const iv = Buffer.from(ivHex, 'hex')
        const encrypted = Buffer.from(dataHex, 'hex')
        const key = crypto.createHash('sha256').update(this.secret).digest()
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
        return decrypted.toString('utf8')
    }
}
