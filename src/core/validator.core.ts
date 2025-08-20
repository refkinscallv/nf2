'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.1.0
 * @license MIT
 */
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

/**
 * CoreValidator class provides methods to validate data transfer objects (DTOs).
 * It uses class-transformer to convert plain objects into class instances and class-validator to validate them.
 */
export default class CoreValidator {
    /**
     * Validates a plain object against a DTO class.
     * It transforms the plain object into an instance of the DTO class and validates it.
     * If validation fails, it returns an object with `valid: false` and the validation errors.
     * If validation succeeds, it returns an object with `valid: true` and the validated data.
     * @param {ClassConstructor<T>} dtoClass - The DTO class to validate against.
     * @param {Record<string, any>} plain - The plain object to validate.
     * @returns {Promise<{ valid: boolean; data?: T; errors?: any[] }>} A promise that resolves to the validation result.
     */
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
        } catch (error) {
            console.error('[VALIDATOR] Unexpected validation error:', error)
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
