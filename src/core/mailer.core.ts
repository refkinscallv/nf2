'use strict';

import nodemailer, { Transporter } from 'nodemailer';
import CoreCommon from '@core/common.core';

export default class CoreMailer {
    private static transport: Transporter | null = null;

    private static getTransport(): Transporter {
        if (this.transport) return this.transport;

        const driver = CoreCommon.env<string>('MAIL_DRIVER', 'smtp');
        const user = CoreCommon.env<string>('MAIL_USER');
        const pass = CoreCommon.env<string>('MAIL_PASS');

        if (!driver || !user || !pass) {
            throw new Error('[MAILER] Missing required mail configuration');
        }

        if (driver.toLowerCase() === 'smtp') {
            const host = CoreCommon.env<string>('MAIL_HOST');
            const port = CoreCommon.env<number>('MAIL_PORT', 587);
            const secure = CoreCommon.env<boolean>('MAIL_SECURE', false);

            if (!host) {
                throw new Error('[MAILER] SMTP host is required for SMTP driver');
            }

            this.transport = nodemailer.createTransport({
                host,
                port,
                secure,
                auth: { user, pass },
            });
        } else {
            this.transport = nodemailer.createTransport({
                service: driver,
                auth: { user, pass },
            });
        }

        return this.transport;
    }

    public static async send({
        to,
        subject,
        html,
    }: {
        to: string | string[];
        subject: string;
        html: string;
    }) {
        const fromName = CoreCommon.env('MAIL_NAME', 'noreply');
        const fromEmail = CoreCommon.env('MAIL_USER', 'noreply@example.com');
        const from = `${fromName} <${fromEmail}>`;

        return CoreCommon.handler(
            async () =>
                this.getTransport().sendMail({ from, to, subject, html }),
            () => null,
        );
    }
}
