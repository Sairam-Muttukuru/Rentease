const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADMIN,
    pass: process.env.EMAIL_ADMIN_PASS
  }
});

const { rentReminderTemplate } = require("./emailTemplates");

module.exports = async (email, tenantName, amountDue, dueDate, propertyName, isOverdue = true) => {
  try {
    let subject, htmlContent;

    if (isOverdue) {
      // 🚨 Urgent / Overdue Template
      subject = `⚠️ Action Required: Rent Overdue for ${propertyName}`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fef2f2; }
            .header { background: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .amount-box { background: #fef2f2; border: 2px dashed #ef4444; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .amount { font-size: 32px; font-weight: bold; color: #dc2626; margin: 10px 0; }
            .button { display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Payment Reminder</h1>
            </div>
            <div class="content">
              <p>Dear <strong>${tenantName}</strong>,</p>
              
              <p>This is a reminder that we have not yet received your rent payment for <strong>${propertyName}</strong>.</p>
              
              <div class="amount-box">
                <p style="margin: 0; color: #7f1d1d; font-weight: bold;">Total Outstanding Amount</p>
                <div class="amount">₹${amountDue.toLocaleString()}</div>
                <p style="margin: 0; font-size: 14px; color: #ef4444;">Due Date: ${new Date(dueDate).toLocaleDateString()}</p>
              </div>
              
              <p>Please clear your dues immediately to avoid further late fees or service interruptions.</p>
              
              <div style="text-align: center;">
                <a href="http://localhost:5173/login" class="button">Pay Now</a>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px;">If you have already made the payment, please ignore this email or contact support.</p>
            </div>
            <div class="footer">
              <p>RentEase Property Management</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      // 👋 Friendly Reminder Template
      subject = `Rent Reminder for ${propertyName}`;
      // Utilizing the imported template. Passing "RentEase Team" as landlordName for now.
      htmlContent = rentReminderTemplate(tenantName, amountDue.toLocaleString(), new Date(dueDate).toLocaleDateString(), "RentEase Team");
    }

    await transporter.sendMail({
      from: `"RentEase Reminders" <${process.env.EMAIL_ADMIN}>`,
      to: email,
      subject: subject,
      html: htmlContent
    });

    console.log(`✅ ${isOverdue ? "Overdue" : "Friendly"} rent reminder sent to ${email} for amount ₹${amountDue}`);
  } catch (err) {
    console.error(`❌ Failed to send reminder to ${email}:`, err.message);
  }
};
