class EmailSender {
    async sendEmail(to, subject, body) {
        console.log(`Sending email to: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}`);
    }
}

module.exports = new EmailSender();