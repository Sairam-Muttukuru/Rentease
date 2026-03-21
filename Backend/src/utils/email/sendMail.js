const nodemailer = require("nodemailer");

// Centralized email credentials handling heart
const emailConfig = {
    user: process.env.EMAIL_ADMIN || process.env.EMAIL_USER,
    pass: process.env.EMAIL_ADMIN_PASS || process.env.EMAIL_PASS
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

/**
 * Robust email sending utility
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML body
 * @param {Array} attachments - Optional Nodemailer attachments
 */
async function sendMail(to, subject, htmlContent, attachments = []) {
    if (!emailConfig.user || !emailConfig.pass) {
        console.error("❌ Email configuration missing! Please set EMAIL_USER/EMAIL_PASS in environment variables.");
        return;
    }

    try {
        await transporter.sendMail({
            from: `"RentEase" <${emailConfig.user}>`,
            to,
            subject,
            html: htmlContent,
            attachments
        });
        console.log("✅ Email sent to:", to);
    } catch (error) {
        console.error("❌ Failed to send email to:", to, error.message);
        throw error; // Re-throw for more specific error handling heart
    }
}

module.exports = sendMail;
