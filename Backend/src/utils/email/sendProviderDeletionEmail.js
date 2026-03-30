const sendMail = require("./sendMail");

const sendProviderDeletionEmail = async (email, name, reason) => {
    const subject = "Account Information: Service Provider Removal 🏠";
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #374151; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; }
            .header { background: #ef4444; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { padding: 20px; }
            .reason-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; font-style: italic; }
            .footer { font-size: 12px; color: #9ca3af; text-align: center; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="cid:renteasefavicon" alt="RentEase" style="height: 50px; margin-bottom: 10px;">
                <h2 style="margin:0; color: white;">Account Status Update</h2>
            </div>
            <div class="content">
                <p>Hello <b>${name}</b>,</p>
                <p>This email is to inform you that your Service Provider profile and associated account have been removed from the <b>RentEase</b> platform by the administration.</p>
                
                <p><b>Reason for removal:</b></p>
                <div class="reason-box">
                    "${reason || "No specific reason provided."}"
                </div>
                
                <p>As a result of this action, you will no longer be able to log in or provide services through the platform. Any ongoing or pending service requests associated with your profile have been cancelled or reassigned.</p>
                
                <p>If you believe this action was taken in error or if you have any questions, please contact our support team.</p>
                
                <p>Best regards,<br>The RentEase Admin Team</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} RentEase Home Management. All rights reserved.
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
