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
            <div style="background-color: #fdfdfd; padding: 40px 0; font-family: 'Inter', sans-serif;">
                <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);">
                    <div style="height: 6px; background: #4f46e5;"></div>
                    
                    <div style="padding: 40px; text-align: center;">
                        <img src="cid:renteasefavicon" alt="Icon" style="width: 42px; height: 42px; margin-bottom: 15px; border-radius: 10px;">
                        <h2 style="color: #1e293b; font-size: 22px; font-weight: 800; margin: 0 0 10px 0;">Verify Your Account</h2>
                        <p style="color: #64748b; font-size: 15px; line-height: 1.5; margin: 0 0 30px 0;">Enter this code to complete your verification.</p>
                        
                        <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 25px; margin-bottom: 30px;">
                            <div style="color: #4f46e5; font-size: 36px; font-weight: 800; letter-spacing: 6px; font-family: 'Courier New', monospace;">${otp}</div>
                        </div>
                        
                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">Code expires in 5 minutes.</p>
                    </div>
                    
                    <div style="background: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="color: #94a3b8; font-size: 11px; margin: 0;">RentEase Inc. | Fast. Easy. Reliable.</p>
                    </div>
                </div>
            </div>
        `;

        await sendMail(to, `RentEase Code: ${otp}`, html);
        console.log("✅ OTP successfully dispatched via central mailer.");
    } catch (error) {
        console.error("❌ Critical OTP dispatcher failure:", error);
    }
};

module.exports = sendOtp;
