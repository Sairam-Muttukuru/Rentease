const sendMail = require("./sendMail");

module.exports = async (email, password) => {
  try {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Ready</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
            
            <!-- Logo Header -->
            <div style="padding: 32px; text-align: left; background: #ffffff; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px;">
                <img src="${process.env.FRONTEND_URL || 'https://rentease-home.vercel.app'}/favicon.png" alt="RentEase" style="height: 32px; width: 32px; border-radius: 8px;" />
                <span style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">RentEase</span>
            </div>

            <!-- Content Body -->
            <div style="padding: 40px 32px;">
                <span style="background: #e0e7ff; color: #4338ca; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Account Setup</span>
                <h1 style="color: #0f172a; margin: 16px 0 24px 0; font-size: 28px; font-weight: 800;">Welcome to the Platform! 🎉</h1>
                
                <p style="font-size: 16px; color: #475569; line-height: 1.7; margin: 0 0 32px 0;">
                    Your <b>Service Provider</b> account has been officially created by the RentEase Admin. You can now access the dashboard to manage your service requests.
                </p>
                
                <div style="background-color: #0f172a; border-radius: 16px; padding: 32px; margin-bottom: 32px; color: #ffffff;">
                    <h2 style="font-size: 12px; color: #94a3b8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 24px 0;">Login Credentials</h2>
                    
                    <div style="margin-bottom: 16px;">
                        <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">EMAIL ADDRESS</div>
                        <div style="font-family: 'Courier New', monospace; font-size: 16px; color: #6366f1; font-weight: 700;">${email}</div>
                    </div>
                    
                    <div>
                        <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">TEMPORARY PASSWORD</div>
                        <div style="font-family: 'Courier New', monospace; font-size: 16px; color: #10b981; font-weight: 700;">${password}</div>
                    </div>
                </div>

                <div style="background-color: #fff7ed; border-left: 4px solid #f97316; padding: 20px; border-radius: 12px; margin-bottom: 32px;">
                    <p style="margin: 0; font-size: 14px; color: #9a3412; line-height: 1.5;">
                        <b>⚠️ Action Required:</b> For your security, please <b>change your temporary password</b> immediately after your first login through your account settings.
                    </p>
                </div>

                <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 18px 40px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                        Login to Your Account
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                <div style="font-weight: 800; color: #6366f1; font-size: 20px; margin-bottom: 8px;">RentEase</div>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">Sent with ♥ from the RentEase Team.</p>
                <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">&copy; ${new Date().getFullYear()} RentEase. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
      `;

    await sendMail(email, "🎉 Welcome to RentEase - Your Service Provider Account is Ready!", html);
    console.log(`✅ Credentials email sent to ${email}`);
  } catch (err) {
    console.error(`❌ Failed to send credentials email to ${email}:`, err.message);
  }
};
