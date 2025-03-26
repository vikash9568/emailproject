require("dotenv").config();
const nodemailer = require("nodemailer");

class Mail {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use `true` for port 465
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        this.mailOptions = {
            from: {
                address: process.env.EMAIL,
                name: "vikash ojha", // Change to your preferred sender name
            },
            to: "",
            cc: "",
            bcc: "",
            subject: "",
            text: "",
            html: "",
            attachments: [],
        };
    }

    setTo(receiver) {
        this.mailOptions.to = receiver;
    }
    
    setCC(cc) {
        this.mailOptions.cc = cc;
    }

    setBCC(bcc) {
        this.mailOptions.bcc = bcc;
    }

    setSubject(subject) {
        this.mailOptions.subject = subject;
    }

    setText(text) {
        this.mailOptions.text = text;
    }

    setHTML(html) {
        this.mailOptions.html = html;
    }
    setAttachment(attachment) {
        this.mailOptions.attachments.push(attachment);
    }

    async send() {
        try {
            const info = await this.transporter.sendMail(this.mailOptions);
            console.log("✅ Email sent:", info.response);
        } catch (error) {
            console.error("❌ Error sending email:", error);
        }
    }
}

module.exports = Mail;
