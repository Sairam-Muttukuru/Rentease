const sendMail = require("./sendMail");

const sendUserBlockEmail = async (email, firstName, reason, isBlocked) => {
    const subject = isBlocked 
        ? "Account Deactivated - RentEase Management" 
        : "Account Reactivated - RentEase Management";
    
    const statusText = isBlocked ? "Blocked/Suspended" : "Reactivated";
    const statusColor = isBlocked ? "#ef4444" : "#10b981";
    
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Security Update</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
            
            <!-- Logo Header -->
            <div style="padding: 24px; text-align: left; background: #ffffff; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px;">
                <img src="${process.env.FRONTEND_URL}/favicon.png" alt="RentEase" style="height: 32px; width: 32px; border-radius: 8px;" />
                <span style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">RentEase</span>
            </div>

            <!-- Header Section -->
            <div style="background: ${isBlocked ? 'linear-gradient(to right, #ef4444, #991b1b)' : 'linear-gradient(to right, #10b981, #065f46)'}; padding: 40px; text-align: center; color: #ffffff;">
                <div style="background: rgba(255,255,255,0.2); width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                    <span style="font-size: 32px;">${isBlocked ? '🔒' : '🔓'}</span>
                </div>
                <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Account ${isBlocked ? 'Deactivated' : 'Reactivated'}</h1>
                <p style="margin: 8px 0 0; opacity: 0.9; font-size: 16px;">Security status update for your profile</p>
            </div>

            <!-- Content Body -->
            <div style="padding: 40px 32px;">
                <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0;">Hello ${firstName},</h2>
                <p style="font-size: 16px; color: #475569; line-height: 1.7; margin: 0 0 32px 0;">
                    This is an official notification regarding the status of your RentEase account. Our administrative team has updated your access permissions.
                </p>
                
                ${isBlocked ? `
                <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                    <h3 style="margin-top: 0; color: #991b1b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Reason for Suspension</h3>
                    <p style="margin-bottom: 0; color: #b91c1c; font-size: 16px; font-style: italic; line-height: 1.6;">"${reason}"</p>
                </div>
                ` : `
                <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                    <p style="margin: 0; color: #166534; font-size: 16px; font-weight: 600;">Account Restored Successfully</p>
                    <p style="margin: 8px 0 0; color: #14532d; font-size: 14px;">Your access has been fully restored. You can now log back into the RentEase portal using your standard credentials.</p>
                </div>
                `}

                <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'https://rentease-home.vercel.app'}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 18px 40px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                        ${isBlocked ? 'Contact Support' : 'Login to Account'}
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                <div style="font-weight: 800; color: #6366f1; font-size: 20px; margin-bottom: 8px;">RentEase</div>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">Securing your property experience.</p>
                <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">&copy; ${new Date().getFullYear()} RentEase Home Management. Security Team.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        console.log(`[EmailService] Preparing ${subject} for ${email}...`);
        await sendMail(email.trim(), subject, html);
        return true;
    } catch (error) {
        console.error("Error sending account status email:", error);
        return false;
    }
};

module.exports = sendUserBlockEmail;
