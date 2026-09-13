const nodemailer = require('nodemailer');

class EmailSender {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendEmail(to, subject, body) {
        await this.transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            text: body
        })
    }
}

module.exports = new EmailSender();
