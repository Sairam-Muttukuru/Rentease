const sendMail = require("./sendMail");
const path = require("path");

/**
 * Sends a premium OTP email to the user
 * @param {string} to - Recipient email
 * @param {number|string} otp - The 6-digit OTP code heart
 */
const sendOtp = async (to, otp) => {
    try {
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Code</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Outfit', sans-serif;">
            <div style="max-width: 480px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                
                <!-- Logo Header -->
                <div style="padding: 32px 32px 10px 32px; text-align: center;">
                    <img src="cid:renteasefavicon" alt="RentEase" style="height: 48px; width: 48px; border-radius: 12px; margin-bottom: 16px; object-fit: contain; background-color: #ffffff; padding: 2px;" />
                    <div style="font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">RentEase</div>
                </div>

                <!-- Content Body -->
                <div style="padding: 32px; text-align: center;">
                    <h1 style="color: #0f172a; margin: 0 0 12px 0; font-size: 24px; font-weight: 800;">Verification Code</h1>
                    <p style="font-size: 16px; color: #64748b; line-height: 1.6; margin: 0 0 32px 0;">
                        Wait! Don't share this code with anyone. Use it to complete your verification on the RentEase platform.
                    </p>
                    
                    <div style="background-color: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 20px; padding: 32px; margin-bottom: 32px;">
                        <div style="color: #4f46e5; font-size: 42px; font-weight: 800; letter-spacing: 12px; font-family: 'Courier New', monospace; line-height: 1;">${otp}</div>
                    </div>

                    <div style="background-color: #fffbeb; border-radius: 12px; padding: 12px 20px; display: inline-block; margin-bottom: 24px;">
                        <p style="margin: 0; font-size: 13px; color: #92400e; font-weight: 600;">
                            🕒 This code will expire in 10 minutes.
                        </p>
                    </div>

                    <p style="font-size: 14px; color: #94a3b8; line-height: 1.5; margin: 0;">
                        If you didn't request this code, you can safely ignore this email.
                    </p>
                </div>
                
                <!-- Footer -->
                <div style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                    <div style="font-weight: 800; color: #6366f1; font-size: 18px; margin-bottom: 4px;">RentEase</div>
                    <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin: 0;">Secure Property Management</p>
                </div>
            </div>
        </body>
        </html>
        `;

        await sendMail(to, `RentEase Code: ${otp}`, html);
        console.log("✅ OTP successfully dispatched via central mailer.");
    } catch (error) {
        console.error("❌ Critical OTP dispatcher failure:", error);
    }
};

module.exports = sendOtp;
