const sendMail = require("./sendMail");

module.exports = async (email, password) => {
  try {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; }
            .header { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .credentials-box { background: #f1f5f9; border-left: 4px solid #6366f1; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .credential-item { margin: 10px 0; }
            .credential-label { font-weight: bold; color: #475569; }
            .credential-value { color: #1e293b; font-family: 'Courier New', monospace; background: white; padding: 8px 12px; border-radius: 6px; display: inline-block; margin-left: 10px; }
            .warning-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 8px; }
            .button { display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3); }
            .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
            .icon { font-size: 24px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to RentEase!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Service Provider Account is Ready</p>
            </div>
            
            <div class="content">
              <p style="font-size: 16px; margin-bottom: 20px;">
                Hello! 👋
              </p>
              
              <p style="font-size: 16px;">
                Great news! The RentEase Admin has created a <strong>Service Provider account</strong> for you. 
                You can now access the platform and start managing service requests.
              </p>
              
              <div class="credentials-box">
                <h3 style="margin-top: 0; color: #1e293b;">🔐 Your Login Credentials</h3>
                <div class="credential-item">
                  <span class="credential-label">Email:</span>
                  <span class="credential-value">${email}</span>
                </div>
                <div class="credential-item">
                  <span class="credential-label">Temporary Password:</span>
                  <span class="credential-value">${password}</span>
                </div>
              </div>
              
              <div class="warning-box">
                <p style="margin: 0; font-size: 15px;">
                  <strong>⚠️ Important Security Notice:</strong><br/>
                  For your security, please <strong>change your password immediately</strong> after your first login. 
                  You can update your password anytime from your account settings.
                </p>
              </div>
              
              <div style="text-align: center;">
                <a href="http://localhost:5173/login" class="button">
                  🚀 Login to Your Account
                </a>
              </div>
              
              <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
                <h4 style="margin-top: 0; color: #1e293b;">📋 Next Steps:</h4>
                <ol style="margin: 10px 0; padding-left: 20px;">
                  <li>Click the button above to login to RentEase</li>
                  <li>Change your temporary password to a secure one</li>
                  <li>Complete your service provider profile</li>
                  <li>Start accepting and managing service requests</li>
                </ol>
              </div>
              
              <p style="margin-top: 30px; font-size: 15px; color: #64748b;">
                If you have any questions or need assistance, feel free to reach out to our support team.
              </p>
              
              <div class="footer">
                <p style="margin: 5px 0;">
                  <strong>RentEase Team</strong><br/>
                  Making property management easier, one service at a time.
                </p>
                <p style="margin: 15px 0 0 0; font-size: 12px; color: #94a3b8;">
                  This is an automated message. Please do not reply to this email.
                </p>
              </div>
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
