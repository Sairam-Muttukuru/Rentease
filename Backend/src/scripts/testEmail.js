require('dotenv').config({ path: __dirname + '/../.env' });
const nodemailer = require("nodemailer");
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'email_test.log');

function log(msg) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}

async function testEmail() {
    // Clear previous log
    fs.writeFileSync(logFile, '');

    log("📧 Testing Email Configuration...");
    log(`User: ${process.env.EMAIL_ADMIN}`);

    if (!process.env.EMAIL_ADMIN || !process.env.EMAIL_ADMIN_PASS) {
        log("❌ Missing EMAIL_ADMIN or EMAIL_ADMIN_PASS in .env");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_ADMIN,
            pass: process.env.EMAIL_ADMIN_PASS
        }
    });

    try {
        log("Attempting to send mail...");
        const info = await transporter.sendMail({
            from: `"RentEase Test" <${process.env.EMAIL_ADMIN}>`,
            to: process.env.EMAIL_ADMIN,
            subject: "RentEase Email Test " + new Date().toISOString(),
            text: "This is a test email to verify credentials.",
            html: "<b>This is a test email to verify credentials.</b>"
        });

        log("✅ Email sent successfully!");
        log("Message ID: " + info.messageId);
    } catch (error) {
        log("❌ Email failed to send:");
        log(error.message);
        if (error.response) log("Response: " + error.response);
    }
}

testEmail();
