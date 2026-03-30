const nodemailer = require("nodemailer");

const fs = require("fs");
const path = require("path");

// Centralized email credentials handling
const emailConfig = {
    user: (process.env.EMAIL_USER || process.env.EMAIL_ADMIN || '').replace(/"/g, ''),
    pass: (process.env.EMAIL_PASS || process.env.EMAIL_ADMIN_PASS || '').replace(/"/g, '')
};

// Robust Favicon Path Resolution
const faviconPaths = [
    path.resolve(__dirname, "../../../../Frontend/public/favicon.png"),       
    path.resolve(__dirname, "../../../../../../Frontend/public/favicon.png"), 
    path.resolve(process.cwd(), "public/favicon.png"),                        
    path.resolve(process.cwd(), "../Frontend/public/favicon.png"),            
    path.join(__dirname, "../../../../public/favicon.png")                    
];
const GlobalFaviconPath = faviconPaths.find(p => fs.existsSync(p));

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

    // Auto-attach favicon if CID is used but not attached
    if (htmlContent.includes('cid:renteasefavicon') && !attachments.some(a => a.cid === 'renteasefavicon') && GlobalFaviconPath) {
        attachments.push({
            filename: 'favicon.png',
            path: GlobalFaviconPath,
            cid: 'renteasefavicon'
        });
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
        throw error;
    }
}

module.exports = sendMail;
module.exports.GlobalFaviconPath = GlobalFaviconPath;
