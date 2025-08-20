'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.1.0
 * @license MIT
 */
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken'
import CoreCommon from '@core/common.core'

/**
 * CoreJwt is a utility class for handling JSON Web Tokens (JWT).
 * It provides methods for signing, verifying, encoding, and decoding JWTs.
 * It uses environment variables for configuration, such as the secret key and expiration time.
 */
export default class CoreJwt {
    /**
     * The secret key used for signing and verifying JWTs.
     * It is retrieved from environment variables and must be defined.
     */
    private static readonly secretKey: string = (() => {
        const key = CoreCommon.env('JWT_SECRET_KEY')
        if (!key) throw new Error('JWT_SECRET_KEY is not defined')
        return key
    })()

    /**
     * The expiration time for JWTs, in seconds.
     * It is retrieved from environment variables and must be a valid number.
     */
    private static readonly expireIn: number = (() => {
        const raw = CoreCommon.env('JWT_EXPIRE_IN', '86400')
        const parsed = Number(raw)
        if (isNaN(parsed)) throw new Error('JWT_EXPIRE_IN must be a number')
        return parsed
    })()

    /**
     * Signs a payload with the secret key to create a JWT.
     * @param payload The payload to sign, which must be an object.
     * @param options Optional signing options.
     * @return {string} The signed JWT as a string.
     */
    public static sign<T extends JwtPayload>(payload: T, options: SignOptions = {}): string {
        return jwt.sign(payload, this.secretKey, {
            expiresIn: this.expireIn,
            ...options,
        })
    }

    /**
     * Verifies a JWT and returns the decoded payload if valid.
     * @param token The JWT to verify.
     * @return {Object} An object containing the verification status and result.
     *                  If successful, `result` contains the decoded payload; otherwise, it contains an error message.
     */
    public static verify<T = any>(token?: string | null): { status: boolean; result: T | string } {
        if (!token) return { status: false, result: 'Token is missing' }

        try {
            const decoded = jwt.verify(token, this.secretKey) as T
            return { status: true, result: decoded }
        } catch (err: any) {
            console.warn(`[JWT] Verification failed: ${err.message}`)
            return {
                status: false,
                result: `Verification failed: ${err.message}`,
            }
        }
    }

    /**
     * Encodes a payload into a JWT without signing it.
     * This method is useful for creating tokens that do not require verification.
     * @param payload The payload to encode, which must be an object.
     * @return {string} The encoded JWT as a string.
     */
    public static encode<T extends object>(payload: T): string {
        return jwt.sign(payload, this.secretKey, {
            algorithm: 'HS256',
            noTimestamp: true,
        })
    }

    /**
     * Decodes a JWT without verifying its signature.
     * This method is useful for extracting information from a token without validating it.
     * @param token The JWT to decode.
     * @return {Object | null} The decoded payload if successful, or null if decoding fails.
     */
    public static decode<T = any>(token: string): T | null {
        try {
            return jwt.decode(token) as T
        } catch (err: any) {
            console.warn(`[JWT] Decoding failed: ${err.message}`)
            return null
        }
    }
}
