const sendMail = require("./sendMail");

const sendProviderDeletionEmail = async (email, name, reason) => {
    const subject = "Account Information: Service Provider Removal 🏠";
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Status Update</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Outfit', sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
            
            <!-- Logo Header -->
            <div style="padding: 24px; text-align: left; background: #ffffff; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px;">
                <img src="cid:renteasefavicon" alt="RentEase" style="height: 32px; width: 32px; border-radius: 8px; object-fit: contain; background-color: #ffffff; padding: 2px;" />
                <span style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">RentEase</span>
            </div>

            <!-- Header Section -->
            <div style="background: linear-gradient(to right, #ef4444, #b91c1c); padding: 40px; text-align: center; color: #ffffff;">
                <div style="background: rgba(255,255,255,0.2); width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                    <span style="font-size: 32px;">⚠️</span>
                </div>
                <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Profile Removal</h1>
                <p style="margin: 8px 0 0; opacity: 0.9; font-size: 16px;">Service Provider Account Update</p>
            </div>

            <!-- Content Body -->
            <div style="padding: 40px 32px;">
                <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0;">Hello ${name},</h2>
                <p style="font-size: 16px; color: #475569; line-height: 1.7; margin: 0 0 32px 0;">
                    This is an official notification to inform you that your Service Provider profile and associated account have been respectfully removed from the <b>RentEase</b> platform by the administration.
                </p>
                
                <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                    <h3 style="margin-top: 0; color: #991b1b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Reason for Removal</h3>
                    <p style="margin-bottom: 0; color: #b91c1c; font-size: 16px; font-style: italic; line-height: 1.6;">"${reason || "Standard administrative cleanup or policy update."}"</p>
                </div>

                <p style="font-size: 15px; color: #64748b; line-height: 1.6; margin-bottom: 32px;">
                    As a result of this action, your credentials are no longer active, and pending service requests have been cancelled or reassigned. We appreciate your interest in the RentEase network.
                </p>

                <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'https://rentease-home.vercel.app'}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 18px 40px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                        Contact Support
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                <div style="font-weight: 800; color: #6366f1; font-size: 20px; margin-bottom: 8px;">RentEase</div>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">Managing excellence in property services.</p>
                <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">&copy; ${new Date().getFullYear()} RentEase. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await sendMail(email, subject, html);
        console.log(`✅ Provider Deletion Email sent to: ${email}`);
    } catch (error) {
        console.error("❌ Error sending deletion email:", error);
    }
};

module.exports = sendProviderDeletionEmail;
