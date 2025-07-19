'use strict';

import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import CoreCommon from '@core/common.core';

export default class CoreJwt {
    private static readonly secretKey: string = (() => {
        const key = CoreCommon.env('JWT_SECRET_KEY');
        if (!key) throw new Error('JWT_SECRET_KEY is not defined');
        return key;
    })();

    private static readonly expireIn: number = (() => {
        const raw = CoreCommon.env('JWT_EXPIRE_IN', '86400');
        const parsed = Number(raw);
        if (isNaN(parsed)) throw new Error('JWT_EXPIRE_IN must be a number');
        return parsed;
    })();

    public static sign<T extends JwtPayload>(
        payload: T,
        options: SignOptions = {},
    ): string {
        return jwt.sign(payload, this.secretKey, {
            expiresIn: this.expireIn,
            ...options,
        });
    }

    public static verify<T = any>(
        token?: string | null,
    ): { status: boolean; result: T | string } {
        if (!token) return { status: false, result: 'Token is missing' };

        try {
            const decoded = jwt.verify(token, this.secretKey) as T;
            return { status: true, result: decoded };
        } catch (err: any) {
            console.warn(`[JWT] Verification failed: ${err.message}`);
            return {
                status: false,
                result: `Verification failed: ${err.message}`,
            };
        }
    }

    public static encode<T extends object>(payload: T): string {
        return jwt.sign(payload, this.secretKey, {
            algorithm: 'HS256',
            noTimestamp: true,
        });
    }

    public static decode<T = any>(token: string): T | null {
        try {
            return jwt.decode(token) as T;
        } catch (err: any) {
            console.warn(`[JWT] Decoding failed: ${err.message}`);
            return null;
        }
    }
}
