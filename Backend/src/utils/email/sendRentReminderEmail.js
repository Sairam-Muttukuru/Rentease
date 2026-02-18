const nodemailer = require("nodemailer");

const sendRentReminderEmail = async ({
    tenantEmail,
    tenantName,
    propertyName,
    dueDate,
    amount,
    daysRemaining
}) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const getDaySuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    let dueDay = dueDate;
    // Extract day if it's a date object or string
    if (dueDate instanceof Date) {
        dueDay = dueDate.getDate();
    } else if (typeof dueDate === 'string' && dueDate.includes('-')) {
        dueDay = parseInt(dueDate.split('-')[2], 10);
    }

    const formattedDate = `${dueDay}${getDaySuffix(dueDay)}`;

    // Dynamic message based on urgency
    let subject = "";
    let message = "";

    if (daysRemaining === 0) {
        subject = `Friendly Reminder: Rent is Due Today! 🏠`;
        message = `This is a gentle reminder that your rent for <strong>${propertyName}</strong> is due <strong>today</strong>.`;
    } else if (daysRemaining === 1) {
        subject = `Reminder: Rent is Due Tomorrow 🏠`;
        message = `Just a quick heads-up that your rent for <strong>${propertyName}</strong> is due <strong>tomorrow</strong>.`;
    } else {
        subject = `Upcoming Rent Reminder: Due in ${daysRemaining} Days 🏠`;
        message = `We hope you're having a great week! This is a reminder that your rent for <strong>${propertyName}</strong> will be due in <strong>${daysRemaining} days</strong>.`;
    }

    const mailOptions = {
        from: `"RentEase Assistant" <${process.env.EMAIL_USER}>`,
        to: tenantEmail,
        subject: subject,
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Rent Reminder</title>
            <style>
                body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; color: #1f2937; }
                .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden; }
                .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 30px; text-align: center; color: white; }
                .header-icon { font-size: 40px; margin-bottom: 10px; display: block; }
                .content { padding: 40px 30px; }
                .greeting { font-size: 22px; font-weight: 700; color: #111827; margin-bottom: 16px; }
                .message { font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; }
                
                .details-card { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 32px; }
                .details-table { width: 100%; border-collapse: collapse; }
                .details-table td { padding: 10px 0; vertical-align: top; }
                .label-cell { color: #6b7280; font-weight: 500; width: 40%; }
                .value-cell { color: #111827; font-weight: 600; text-align: right; width: 60%; }
                
                .cta-button { display: block; width: 100%; text-align: center; background: #2563eb; color: white !important; text-decoration: none; padding: 14px 0; border-radius: 8px; font-weight: 600; font-size: 16px; margin-top: 10px; }
                .footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 13px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <span class="header-icon">📅</span>
                    <h2 style="margin:0; font-weight: 600;">Rent Reminder</h2>
                </div>
                <div class="content">
                    <h1 class="greeting">Hi ${tenantName},</h1>
                    
                    <p class="message">
                        ${message}
                    </p>
                    
                    <div class="details-card">
                        <table class="details-table">
                            <tr>
                                <td class="label-cell">Property</td>
                                <td class="value-cell">${propertyName}</td>
                            </tr>
                            <tr>
                                <td class="label-cell">Amount Due</td>
                                <td class="value-cell">₹${amount}</td>
                            </tr>
                            <tr>
                                <td class="label-cell">Due Date</td>
                                <td class="value-cell">${formattedDate} of this month</td>
                            </tr>
                        </table>
                    </div>

                    <a href="${process.env.FRONTEND_URL}/login" class="cta-button">Pay Securely via RentEase</a>
                </div>
                
                <div class="footer">
                    <p>RentEase Automated Reminders</p>
                </div>
            </div>
        </body>
        </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Rent Reminder sent to: ${tenantEmail} (${daysRemaining} days left)`);
    } catch (error) {
        console.error("❌ Error sending rent reminder:", error);
    }
};

module.exports = sendRentReminderEmail;
