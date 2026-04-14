const sendMail = require("./sendMail");
const { rentReminderTemplate } = require("./emailTemplates");

module.exports = async (email, tenantName, amountDue, dueDate, propertyName, isOverdue = true) => {
  try {
    let subject, htmlContent;

    if (isOverdue) {
      // 🚨 Urgent / Overdue Template
      subject = `⚠️ Action Required: Rent Overdue for ${propertyName}`;
      htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Required</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #fef2f2; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(239, 68, 68, 0.1); border: 1px solid #fee2e2;">
                
                <!-- Logo Header -->
                <div style="padding: 24px; text-align: left; background: #ffffff; border-bottom: 1px solid #fef2f2; display: flex; align-items: center; gap: 12px;">
                    <img src="${process.env.FRONTEND_URL}/favicon.png" alt="RentEase" style="height: 32px; width: 32px; border-radius: 8px;" />
                    <span style="font-size: 20px; font-weight: 800; color: #991b1b; letter-spacing: -0.5px;">RentEase</span>
                </div>

                <!-- Content Body -->
                <div style="padding: 40px 32px;">
                    <span style="background: #fee2e2; color: #dc2626; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Urgent: Overdue</span>
                    <h1 style="color: #111827; margin: 16px 0 24px 0; font-size: 28px; font-weight: 800;">Action Required, ${tenantName}</h1>
                    
                    <p style="font-size: 16px; color: #475569; line-height: 1.7; margin: 0 0 32px 0;">
                        This is a formal reminder that we have not yet received your rent payment for <b>${propertyName}</b>. 
                    </p>
                    
                    <div style="background-color: #fef2f2; border: 2px dashed #ef4444; border-radius: 16px; padding: 32px; margin-bottom: 32px; text-align: center;">
                        <div style="color: #991b1b; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Outstanding Balance</div>
                        <div style="font-size: 42px; font-weight: 900; color: #dc2626; margin-bottom: 8px;">₹${amountDue.toLocaleString()}</div>
                        <div style="color: #ef4444; font-size: 14px; font-weight: 600;">Due Date: ${new Date(dueDate).toLocaleDateString()}</div>
                    </div>

                    <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 32px; text-align: center;">
                        Please clear your outstanding dues immediately to avoid potential late fees or interruptions to your residency services.
                    </p>

                    <div style="text-align: center;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background-color: #dc2626; color: #ffffff; padding: 18px 40px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 16px; box-shadow: 0 10px 20px rgba(220, 38, 38, 0.2);">
                            Pay Securely Now
                        </a>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="padding: 32px; background-color: #fcfcfc; border-top: 1px solid #f3f4f6; text-align: center;">
                    <div style="font-weight: 800; color: #dc2626; font-size: 18px; margin-bottom: 8px;">RentEase Management</div>
                    <p style="font-size: 12px; color: #94a3b8; margin: 0;">If you have already made the payment, please disregard this notice.</p>
                </div>
            </div>
        </body>
        </html>
      `;
    } else {
      // 👋 Friendly Reminder Template
      subject = `Rent Reminder for ${propertyName}`;
      htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Friendly Reminder</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
                
                <!-- Logo Header -->
                <div style="padding: 24px; text-align: left; background: #ffffff; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px;">
                    <img src="${process.env.FRONTEND_URL}/favicon.png" alt="RentEase" style="height: 32px; width: 32px; border-radius: 8px;" />
                    <span style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">RentEase</span>
                </div>

                <!-- Content Body -->
                <div style="padding: 40px 32px;">
                    <span style="background: #e0e7ff; color: #4338ca; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Gentle Reminder</span>
                    <h1 style="color: #0f172a; margin: 16px 0 24px 0; font-size: 28px; font-weight: 800;">Hello ${tenantName}, 👋</h1>
                    
                    <p style="font-size: 16px; color: #475569; line-height: 1.7; margin: 0 0 32px 0;">
                        Just a friendly heads-up that your rent for <b>${propertyName}</b> is coming up. We appreciate you choosing RentEase for your home management.
                    </p>
                    
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; margin-bottom: 32px;">
                        <h2 style="font-size: 12px; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 24px 0;">Payment Overview</h2>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Property</td>
                                <td style="padding: 10px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${propertyName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Amount Due</td>
                                <td style="padding: 10px 0; color: #6366f1; font-size: 18px; font-weight: 800; text-align: right;">₹${amountDue.toLocaleString()}</td>
                            </tr>
                            <tr style="border-top: 1px solid #e2e8f0;">
                                <td style="padding: 14px 0 10px 0; color: #64748b; font-size: 14px;">Due Date</td>
                                <td style="padding: 14px 0 10px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${new Date(dueDate).toLocaleDateString()}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="text-align: center;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 18px 40px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                            Pay Securely via Dashboard
                        </a>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                    <div style="font-weight: 800; color: #6366f1; font-size: 20px; margin-bottom: 8px;">RentEase</div>
                    <p style="font-size: 12px; color: #94a3b8; margin: 0;">Providing excellence in property management.</p>
                </div>
            </div>
        </body>
        </html>
      `;
    }

    await sendMail(email, subject, htmlContent);
    console.log(`✅ ${isOverdue ? "Overdue" : "Friendly"} rent reminder sent to ${email} for amount ₹${amountDue}`);
  } catch (err) {
    console.error(`❌ Failed to send reminder to ${email}:`, err.message);
  }
};
