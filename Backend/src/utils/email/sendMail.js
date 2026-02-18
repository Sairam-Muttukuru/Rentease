const nodemailer = require("nodemailer");

async function sendMail(to, subject, htmlContent) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: `"RentEase" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent
    });

    console.log("✅ Email sent to:", to);
}

module.exports = sendMail;   // 🚨 DEFAULT EXPORT (FUNCTION ONLY)
