'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.1.0
 * @license MIT
 */
import 'dotenv/config'
import { createHash } from 'crypto'
import { CoreCommonUrl } from '@type/core'
import { resolve } from 'path'

/**
 * CoreCommon class provides utility functions for common operations in the application.
 * It includes methods for environment variable access, URL construction, path resolution, and various string manipulations.
 */
export default class CoreCommon {
    /**
     * Retrieves an environment variable with a default value.
     * @param key The name of the environment variable.
     * @param defaultVal The default value to return if the environment variable is not set.
     * @return The value of the environment variable or the default value.
     * @template T The type of the environment variable value.
     */
    public static env<T = any>(key: string, defaultVal: any | null = null): T {
        return (process.env[key] ?? defaultVal) as T
    }

    /**
     * Constructs a URL based on the provided base and path.
     * @param base The base URL type, can be 'base', 'api', or 'static'.
     * @param path The path to append to the base URL.
     * @return The constructed URL as a string.
     */
    public static url(base: CoreCommonUrl = 'base', path: string = ''): string {
        const baseUrls: Record<CoreCommonUrl, string> = {
            base: CoreCommon.env<string>('APP_URL', 'http://localhost:3000'),
            api: CoreCommon.env<string>('APP_URL', 'http://localhost:3000') + '/api',
            static: CoreCommon.env<string>('APP_URL', 'http://localhost:3000') + '/static',
        }

        const cleanBase = baseUrls[base].replace(/\/+$/, '')
        const cleanPath = path.replace(/^\/+/, '').replace(/\/+$/, '')

        return cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase
    }

    /**
     * Resolves a path relative to the current working directory.
     * @param paths The paths to resolve, can be multiple segments.
     * @return The resolved path as a string.
     *
     */
    public static path(...paths: string[]): string {
        const root = process.cwd()
        const cleanPaths = paths.map((p) => p.replace(/^\/+|\/+$/g, ''))
        return resolve(root, ...cleanPaths)
    }

    /**
     * Extracts a specific part of a URL based on the provided key.
     * @param fullUrl The full URL to extract from.
     * @param get The key to extract, can be any valid URL property like 'hostname', 'pathname', etc.
     * @return The extracted part of the URL as a string or the full URL if parsing fails.
     */
    public static extractUrl(fullUrl: string, get: Exclude<keyof URL, 'toJSON'>): string | URL[keyof URL] {
        try {
            const url = new URL(fullUrl)
            return url[get]
        } catch {
            return fullUrl
        }
    }

    /**
     * Generates a JSON response structure.
     * @param status The status of the response, default is true.
     * @param code The HTTP status code, default is 200.
     * @param message The message to include in the response, default is an empty string.
     * @param result The result data to include in the response, default is an empty object
     * @param custom Additional custom data to include in the response.
     * @return The JSON response object.
     */
    public static json(status = true, code = 200, message = '', result: Record<string, any> | any[] | null = {}, custom: Partial<Record<string, any>> = {}) {
        return { status, code, message, result, ...custom }
    }

    /**
     * Executes a callback function and handles any errors that may occur.
     * @param callback The function to execute, which should return a Promise.
     * @param shouldThrow Optional function to handle errors, can return a value or throw an error.
     * @return The result of the callback function or the value returned by shouldThrow.
     * @throws If an error occurs and shouldThrow is not provided or does not return a value.
     * @template T The type of the result returned by the callback function.
     * @return {Promise<T>} A promise that resolves to the result of the callback function.
     */
    public static async handler<T>(callback: () => Promise<T>, shouldThrow?: (err: any) => T | Promise<T> | void): Promise<T> {
        try {
            return await callback()
        } catch (err) {
            if (shouldThrow) {
                const result = await shouldThrow(err)
                if (result !== undefined) return result
            }
            throw err
        }
    }

    /**
     * Generates an MD5 hash of the input string.
     * @param input The string to hash.
     * @return The MD5 hash of the input string as a hexadecimal string.
     */
    public static md5(input: string): string {
        return createHash('md5').update(input).digest('hex')
    }

    /**
     * Generates a unique identifier.
     * @param prefix Optional prefix to prepend to the identifier.
     * @param moreEntropy Optional flag to add more entropy to the identifier.
     * @return A unique identifier string.
     */
    public static uniqid(prefix = '', moreEntropy = false): string {
        const now = Date.now().toString(16)
        const random = Math.floor(Math.random() * 0xfffff).toString(16)
        const entropy = moreEntropy ? '.' + process.hrtime.bigint().toString(36) : ''
        return `${prefix}${now}${random}${entropy}`
    }

    /**
     * Pauses execution for a specified number of milliseconds.
     * @param ms The number of milliseconds to sleep.
     * @return A promise that resolves after the specified time.
     */
    public static sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    /**
     * Checks if a value is empty.
     * @param val The value to check.
     * @return True if the value is empty, false otherwise.
     */
    public static isEmpty(val: any): boolean {
        if (typeof val === 'undefined') return true
        if (val == null) return true
        if (typeof val === 'string' || Array.isArray(val)) return val.length === 0
        if (typeof val === 'object') return Object.keys(val).length === 0
        return false
    }

    /**
     * Capitalizes the first letter of a string.
     * @param str The string to capitalize.
     * @return The string with the first letter capitalized.
     */
    public static capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    /**
     * Converts a value to a boolean.
     * @param val The value to convert.
     * @return True if the value is truthy, false otherwise.
     */
    public static toBool(val: any): boolean {
        if (typeof val === 'boolean') return val
        if (typeof val === 'string') return ['true', '1', 'yes', 'on'].includes(val.toLowerCase())
        return Boolean(val)
    }

    /**
     * Converts a string to camelCase.
     * @param str The string to convert.
     * @return The camelCased string.
     */
    public static camelCase(str: string): string {
        return str.replace(/[_-](\w)/g, (_, c) => c.toUpperCase())
    }

    /**
     * Converts a string to snake_case.
     * @param str The string to convert.
     * @return The snake_cased string.
     */
    public static snakeCase(str: string): string {
        return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`).replace(/^_/, '')
    }

    /**
     * Converts a string to kebab-case.
     * @param str The string to convert.
     * @return The kebab-cased string.
     */
    public static className(instance: any): string {
        return instance?.constructor?.name ?? ''
    }

    /**
     * Limits the length of a string to a specified number of characters.
     * @param str The string to limit.
     * @param limit The maximum length of the string.
     * @param end The string to append if the original string exceeds the limit.
     * @return The limited string.
     */
    public static strLimit(str: string, limit = 100, end = '...'): string {
        return str.length > limit ? str.slice(0, limit) + end : str
    }

    /**
     * Checks if a string contains a specific substring.
     * @param str The string to check.
     * @param search The substring to search for.
     * @return True if the string contains the substring, false otherwise.
     */
    public static strContains(str: string, search: string): boolean {
        return str.includes(search)
    }

    /**
     * Checks if a string starts with a specific prefix.
     * @param str The string to check.
     * @param prefix The prefix to check for.
     * @return True if the string starts with the prefix, false otherwise.
     */
    public static startsWith(str: string, prefix: string): boolean {
        return str.startsWith(prefix)
    }

    /**
     * Checks if a string ends with a specific suffix.
     * @param str The string to check.
     * @param suffix The suffix to check for.
     * @return True if the string ends with the suffix, false otherwise.
     */
    public static endsWith(str: string, suffix: string): boolean {
        return str.endsWith(suffix)
    }

    /**
     * Normalizes a path by removing leading and trailing slashes.
     * @param path The path to normalize.
     * @return The normalized path.
     */
    public static normalizePath(path: string): string {
        return path.replace(/^\/+|\/+$/g, '')
    }

    /**
     * Normalizes an array of relations by ensuring they are unique and formatted correctly.
     * @param relations The relations to normalize, can be a string or an array of strings.
     * @return An array of unique normalized relations.
     */
    public static normalizeRelations(relations: string | string[]): string[] {
        if (typeof relations === 'string') {
            return [relations]
        }
        return Array.from(new Set(relations)).map((relation) => relation.trim())
    }
}
