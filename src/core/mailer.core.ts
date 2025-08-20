'use strict'

/**
 * @module NF2
 * @description A modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM
 * @author Refkinscallv
 * @repository https://github.com/refkinscallv/nf2
 * @version 2.1.0
 * @license MIT
 */
import nodemailer, { Transporter } from 'nodemailer'
import CoreCommon from '@core/common.core'

/**
 * CoreMailer is a utility class for sending emails using Nodemailer.
 * It supports both SMTP and service-based email sending.
 * It retrieves configuration from environment variables.
 * It provides a method to send emails with a specified recipient, subject, and HTML content.
 * It handles errors gracefully and logs them.
 */
export default class CoreMailer {
    /**
     * The transport instance used for sending emails.
     * It is created based on the configuration provided in environment variables.
     */
    private static transport: Transporter | null = null

    /**
     * Retrieves the transport instance for sending emails.
     * It creates a new transport instance if it doesn't already exist.
     * It uses environment variables to configure the transport settings.
     * @return {Transporter} The Nodemailer transport instance.
     * @throws {Error} If required configuration is missing.
     */
    private static getTransport(): Transporter {
        if (this.transport) return this.transport

        const driver = CoreCommon.env<string>('MAIL_DRIVER', 'smtp')
        const user = CoreCommon.env<string>('MAIL_USER')
        const pass = CoreCommon.env<string>('MAIL_PASS')

        if (!driver || !user || !pass) {
            throw new Error('[MAILER] Missing required mail configuration')
        }

        if (driver.toLowerCase() === 'smtp') {
            const host = CoreCommon.env<string>('MAIL_HOST')
            const port = CoreCommon.env<number>('MAIL_PORT', 587)
            const secure = CoreCommon.env<boolean>('MAIL_SECURE', false)

            if (!host) {
                throw new Error('[MAILER] SMTP host is required for SMTP driver')
            }

            this.transport = nodemailer.createTransport({
                host,
                port,
                secure,
                auth: { user, pass },
            })
        } else {
            this.transport = nodemailer.createTransport({
                service: driver,
                auth: { user, pass },
            })
        }

        return this.transport
    }

    /**
     * Sends an email using the configured transport.
     * It requires a recipient, subject, and HTML content for the email.
     * It returns a promise that resolves when the email is sent successfully.
     * @param {Object} params - The parameters for sending the email.
     * @param {string | string[]} params.to - The recipient(s) of the email.
     * @param {string} params.subject - The subject of the email.
     * @param {string} params.html - The HTML content of the email.
     * @return {Promise<void>} A promise that resolves when the email is sent.
     */
    public static async send({ to, subject, html }: { to: string | string[]; subject: string; html: string }) {
        const fromName = CoreCommon.env('MAIL_NAME', 'noreply')
        const fromEmail = CoreCommon.env('MAIL_USER', 'noreply@example.com')
        const from = `${fromName} <${fromEmail}>`

        return CoreCommon.handler(
            async () => this.getTransport().sendMail({ from, to, subject, html }),
            () => null,
        )
    }
}
