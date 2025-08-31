'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.2.1
 * @license MIT
 */
import 'module-alias/register'
import 'reflect-metadata'
import 'dotenv/config'
import '@app/hooks/register.hook'
import '@core/scope.core'

/**
 * Main entry point for the application
 * Initializes the application by booting the core components
 */
import CoreBoot from '@core/boot.core'

/**
 * Bootstraps the application
 */
;(async () => {
    await CoreBoot.run()
})()
