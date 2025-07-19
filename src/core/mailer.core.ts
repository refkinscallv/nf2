'use strict';

import nodemailer, { Transporter } from 'nodemailer';
import CoreCommon from '@core/common.core';

export default class CoreMailer {
    private static transport: Transporter | null = null;

    private static getTransport(): Transporter {
        if (this.transport) return this.transport;

        const service = CoreCommon.env<string>('MAIL_DRIVER');
        const user = CoreCommon.env<string>('MAIL_USER');
        const pass = CoreCommon.env<string>('MAIL_PASS');

        if (!service || !user || !pass) {
            throw new Error('[MAILER] Missing required mail configuration');
        }

        this.transport = nodemailer.createTransport({
            service,
            auth: { user, pass },
        });

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
