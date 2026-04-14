const sendMail = require("./sendMail");
const path = require("path");

const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const cleanName = (userName || "").replace(/undefined/g, "").trim() || "Valued Merchant";

        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to RentEase</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
                
                <!-- Logo Header -->
                <div style="padding: 32px; text-align: center; background: #ffffff;">
                    <img src="${process.env.FRONTEND_URL}/favicon.png" alt="RentEase" style="height: 48px; width: 48px; border-radius: 12px; margin-bottom: 12px;" />
                    <div style="font-size: 24px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px;">RentEase</div>
                    <div style="color: #6366f1; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 4px;">Smart Home Management</div>
                </div>

                <!-- Hero Section -->
                <div style="height: 4px; background: linear-gradient(to right, #6366f1, #a855f7);"></div>

                <!-- Content Body -->
                <div style="padding: 60px 50px; text-align: center;">
                    <h1 style="color: #111827; font-size: 36px; font-weight: 900; line-height: 1.1; margin: 0 0 24px 0;">
                        Welcome home,<br>
                        <span style="color: #6366f1;">${cleanName}</span>
                    </h1>
                    <p style="color: #4b5563; font-size: 18px; line-height: 1.6; margin: 0 0 40px 0;">
                        You've just joined the modern way to manage properties. We're excited to help you streamline your rental journey.
                    </p>

                    <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 24px; padding: 40px; text-align: left;">
                        <h3 style="color: #64748b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 25px 0;">Quick Start Guide</h3>
                        
                        <div style="margin-bottom: 24px;">
                            <div style="color: #0f172a; font-weight: 700; font-size: 16px; margin-bottom: 6px;">1. Update Your Profile</div>
                            <div style="color: #64748b; font-size: 14px; line-height: 1.5;">Ensure your details are accurate to facilitate smooth communication with landlords and tenants.</div>
                        </div>

                        <div>
                            <div style="color: #0f172a; font-weight: 700; font-size: 16px; margin-bottom: 6px;">2. Explore Dashboard</div>
                            <div style="color: #64748b; font-size: 14px; line-height: 1.5;">Check out your property listings, payments, and notices all from one central hub.</div>
                        </div>
                    </div>

                    <div style="margin-top: 50px;">
                        <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 18px 40px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                            Access Your Dashboard
                        </a>
                    </div>
                </div>

                <!-- Footer -->
                <div style="padding: 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="font-size: 13px; color: #94a3b8; margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} RentEase Ecosystem. All rights reserved.</p>
                    <div style="color: #cbd5e1; font-size: 12px;">Providing excellence in property management.</div>
                </div>
            </div>
        </body>
        </html>
        `;

        await sendMail(userEmail, "Welcome to RentEase!", html);
        console.log(`✅ Welcome email successfully dispatched via central mailer to ${userEmail}`);
    } catch (error) {
        console.error("❌ Critical Welcome dispatcher failure:", error);
    }
};

module.exports = sendWelcomeEmail;
