const nodemailer = require('nodemailer');

class SendEmailCommand {
  constructor(to, subject, text, attachments = []) {
    this.to = to;
    this.subject = subject;
    this.text = text;
    this.attachments = attachments;
  }

  async execute() {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Sistema de Medicamentos" <${process.env.EMAIL_FROM}>`,
      to: this.to,
      subject: this.subject,
      text: this.text,
      attachments: this.attachments,
    };

    return transporter.sendMail(mailOptions);
  }
}

module.exports = SendEmailCommand;