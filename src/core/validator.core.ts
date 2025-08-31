'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.2.1
 * @license MIT
 */
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import Logger from '@core/logger.core'

export default class CoreValidator {
    public static async make<T extends object>(
        dtoClass: ClassConstructor<T>,
        plain: Record<string, any>,
    ): Promise<
        | { valid: true; data: T }
        | {
              valid: false
              errors: {
                  property: string
                  constraints?: Record<string, string>
              }[]
          }
    > {
        try {
            const instance = plainToInstance(dtoClass, plain)
            const errors = await validate(instance, {
                whitelist: true,
                forbidNonWhitelisted: true,
            })

            if (errors.length > 0) {
                return {
                    valid: false,
                    errors: errors.map((err) => ({
                        property: err.property,
                        constraints: err.constraints,
                    })),
                }
            }

            return { valid: true, data: instance }
        } catch (err) {
            if (err instanceof Error) {
                Logger.error(`VALIDATOR - Failed to start application: ${err.message}`, err)
            } else {
                Logger.error('VALIDATOR - Failed to start application: Unknown error', new Error(String(err)))
            }
            return {
                valid: false,
                errors: [
                    {
                        property: 'internal',
                        constraints: {
                            internal: 'Unexpected error during validation.',
                        },
                    },
                ],
            }
        }
    }
}
