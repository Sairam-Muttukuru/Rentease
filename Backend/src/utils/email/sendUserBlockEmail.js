const sendMail = require("./sendMail");

const sendUserBlockEmail = async (email, firstName, reason, isBlocked) => {
    const subject = isBlocked 
        ? "Account Deactivated - RentEase Management" 
        : "Account Reactivated - RentEase Management";
    
    const statusText = isBlocked ? "Blocked/Suspended" : "Reactivated";
    const statusColor = isBlocked ? "#ef4444" : "#10b981";
    
    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 40px auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); background-color: #ffffff;">
            <div style="background: linear-gradient(135deg, ${statusColor} 0%, #000000 100%); padding: 30px; text-align: center; color: white;">
                <img src="cid:renteasefavicon" alt="Icon" style="width: 48px; height: 48px; margin-bottom: 12px; border-radius: 12px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Security Notification</h1>
            </div>
            <div style="padding: 40px 30px; background-color: #ffffff;">
                <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-top: 0; margin-bottom: 16px;">Hello ${firstName},</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-top: 0; margin-bottom: 24px;">
                    This is an automated notification regarding your RentEase account status. Your account has been <strong>${statusText}</strong> by the system administrator.
                </p>
                
                ${isBlocked ? `
                <div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                    <h3 style="margin-top: 0; color: #991b1b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Reason for Suspension:</h3>
                    <p style="margin-bottom: 0; color: #b91c1c; font-size: 16px; font-style: italic;">"${reason}"</p>
                </div>
                ` : `
                <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                    <p style="margin: 0; color: #166534; font-size: 16px;">Your account access has been restored. You can now login using your registered credentials.</p>
                </div>
                `}

                <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
                    ${isBlocked 
                        ? "While your account is blocked, you will not be able to login or access any RentEase services. If you believe this is a mistake, please reach out to our support team." 
                        : "Thank you for being a part of RentEase."}
                </p>

                <div style="text-align: center; margin-top: 32px;">
                    <a href="https://rentease-home.vercel.app" style="display: inline-block; background-color: #111827; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">Visit Website</a>
                </div>
            </div>
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} RentEase Home Management. Internal Security Team.</p>
            </div>
        </div>
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
