import Mailjet from 'node-mailjet';

import * as dotenv from 'dotenv';
dotenv.config();

export class MailJet {
    private static instance: MailJet;
    private mailjetClient: any;

    // Private constructor to prevent direct instantiation
    private constructor() {
        const apiKey = process.env.MAILJET_PUBLIC_KEY;
        const apiSecret = process.env.MAILJET_SECRET_KEY;

        if (!apiKey || !apiSecret) {
            throw new Error('Mailjet API keys are missing in .env');
        }

        this.mailjetClient = Mailjet.apiConnect(apiKey, apiSecret);
    }

    // Public method to get the singleton instance
    public static getInstance(): MailJet {
        if (!MailJet.instance) {
            MailJet.instance = new MailJet();
        }
        return MailJet.instance;
    }

    // Method to send an email
    public async sendMail(
        toEmail: string,
        toName: string,
        subject: string,
        htmlContent: string
    ): Promise<any> {
        const request = {
            Messages: [
                {
                    From: {
                        Email: 'uralive.wcs@gmail.com',
                        Name: 'URaLive',
                    },
                    To: [
                        {
                            Email: toEmail,
                            Name: toName,
                        },
                    ],
                    Subject: subject,
                    HTMLPart: htmlContent,
                },
            ],
        };

        try {
            const response = await this.mailjetClient.post('send', { version: 'v3.1' }).request(request);
            return response.body;
        } catch (error: any) {
            console.error('Mailjet Error:', error.response?.statusCode, error.response?.body);
            throw error;
        }
    }
}
