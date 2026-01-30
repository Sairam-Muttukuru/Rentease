const nodemailer = require("nodemailer");
require("dotenv").config();

async function testEmail() {
    console.log("Transporter Config:");
    console.log("User:", process.env.EMAIL_USER);
    console.log("Pass:", process.env.EMAIL_PASS ? "********" : "MISSING");

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("❌ EMAIL_USER or EMAIL_PASS environment variables are missing.");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.verify();
        console.log("✅ Server is ready to take our messages");

        const info = await transporter.sendMail({
            from: `"RentEase Debug" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to self for testing
            subject: "RentEase Email Test",
            text: "If you are reading this, the email configuration is correct!",
            html: "<b>If you are reading this, the email configuration is correct!</b>"
        });

        console.log("✅ Message sent: %s", info.messageId);
    } catch (error) {
        console.error("❌ Error sending email:", error);

        if (error.code === 'EAUTH') {
            console.log("\n💡 TIP: For Gmail, ensure you are using an **App Password**.");
            console.log("1. Go to Google Account > Security");
            console.log("2. Enable 2-Step Verification");
            console.log("3. Search for 'App Passwords'");
            console.log("4. Create a new one and paste it in .env under EMAIL_PASS");
        }
    }
}

testEmail();
