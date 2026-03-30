const sendMail = require("./sendMail");
const path = require("path");

const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const cleanName = (userName || "").replace(/undefined/g, "").trim() || "Valued Merchant";

        const html = `
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Playfair+Display:ital,wght@1,700&display=swap" rel="stylesheet">
            </head>
            <div style="background-color: #f3f4f6; padding: 50px 0; margin: 0; width: 100%; font-family: 'Inter', sans-serif;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                    <tr>
                        <td style="padding: 70px 0 40px 0; text-align: center;">
                            <img src="cid:renteasefavicon" alt="RentEase" width="150" height="120" style="border-radius: 20px;">
                            <div style="color: #4f46e5; font-size: 14px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; margin-top: 15px;">Home Management</div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 60px 45px 60px; text-align: center;">
                            <h1 style="color: #111827; font-size: 34px; font-weight: 800; line-height: 1.1; margin: 0 0 20px 0;">
                                Welcome home,<br>
                                <span style="font-family: 'Playfair Display', Georgia, serif; font-style: italic; color: #4f46e5;">${cleanName}</span>
                            </h1>
                            <p style="color: #4b5563; font-size: 18px; line-height: 1.6; margin: 0;">
                                You've just joined the modern way to manage rentals. We're excited to help you streamline your property journey.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 60px 50px 60px;">
                            <div style="background-color: #f9fafb; border: 1px solid #f1f5f9; border-radius: 24px; padding: 40px;">
                                <h3 style="color: #64748b; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 25px 0;">Get Started</h3>
                                <div style="color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 4px;">1. Complete Profile</div>
                                <div style="color: #64748b; font-size: 14px; margin-bottom: 20px;">Verify your identity to get approved for properties faster.</div>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        `;

        await sendMail(userEmail, "Welcome to RentEase! 🏠", html);
        console.log(`✅ Welcome email successfully dispatched via central mailer to ${userEmail}`);
    } catch (error) {
        console.error("❌ Critical Welcome dispatcher failure:", error);
    }
};

module.exports = sendWelcomeEmail;
