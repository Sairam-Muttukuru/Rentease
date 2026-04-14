const sendMail = require("./sendMail");

const sendRentReminderEmail = async ({
    tenantEmail,
    tenantName,
    propertyName,
    dueDate,
    amount,
    daysRemaining,
    propertyImage,
    monthsPending = 1
}) => {
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
    if (dueDate instanceof Date) {
        dueDay = dueDate.getDate();
    } else if (typeof dueDate === 'string' && dueDate.includes('-')) {
        dueDay = parseInt(dueDate.split('-')[2], 10);
    }
    const formattedDate = `${dueDay}${getDaySuffix(dueDay)}`;

    let subject = "";
    let message = "";
    let statusLabel = "";
    let statusColor = "";

    if (monthsPending > 1) {
        subject = `⚠️ URGENT: Outstanding Balance of ₹${amount.toLocaleString()} for ${propertyName}`;
        message = `This is a reminder regarding your cumulative outstanding rent for <b>${propertyName}</b>. Our records show an unpaid balance spanning <b>${monthsPending} months</b>.`;
        statusLabel = "Overdue Alert";
        statusColor = "#dc2626";
    } else if (daysRemaining === 0) {
        subject = `Friendly Reminder: Rent is Due Today!`;
        message = `This is a gentle reminder that your rent for <b>${propertyName}</b> is due <b>today</b>.`;
        statusLabel = "Due Today";
        statusColor = "#dc2626";
    } else if (daysRemaining === 1) {
        subject = `Reminder: Rent is Due Tomorrow`;
        message = `Just a quick heads-up that your rent for <b>${propertyName}</b> is due <b>tomorrow</b>.`;
        statusLabel = "Due Tomorrow";
        statusColor = "#4f46e5";
    } else {
        subject = `Upcoming Rent Reminder: Due in ${daysRemaining} Days`;
        message = `We hope you're having a great week! This is a reminder that your rent for <b>${propertyName}</b> will be due in <b>${daysRemaining} days</b>.`;
        statusLabel = `Due in ${daysRemaining} Days`;
        statusColor = "#6366f1";
    }

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rent Reminder</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
            
            <!-- Logo Header (Table-based for Bulletproof Rendering) -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                <tr>
                    <td style="padding: 24px;">
                        <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="vertical-align: middle; padding-right: 12px;">
                                    <img src="${process.env.FRONTEND_URL || 'https://rentease-home.vercel.app'}/favicon.png" alt="Logo" width="32" height="32" style="display: block; width: 32px; height: 32px; border-radius: 8px;" />
                                </td>
                                <td style="vertical-align: middle;">
                                    <span style="font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; font-family: 'Segoe UI', Arial, sans-serif;">RentEase</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- Top Property Image -->
            <div style="height: 240px; background-color: #f1f5f9; overflow: hidden;">
                <img src="${propertyImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600'}" alt="Property" width="600" style="width: 100%; height: auto; display: block;" />
            </div>

            <!-- Main Content Area -->
            <div style="padding: 32px;">
                <!-- Status Badge -->
                <div style="margin: -8px 0 24px 0;">
                    <span style="background: ${statusColor}; color: white; padding: 8px 18px; border-radius: 12px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; display: inline-block; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);">
                        ${statusLabel}
                    </span>
                </div>

                <!-- Personal Message -->
                <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 32px;">
                    <p style="font-size: 18px; color: #334155; line-height: 1.6; margin: 0; font-weight: 500;">
                        ${message} <span style="font-size: 24px;">👋</span>
                    </p>
                </div>
                
                <!-- Financial Summary Card -->
                <div style="background-color: #f8fafc; border-radius: 28px; border: 1px solid #f1f5f9; padding: 32px; margin-bottom: 32px;">
                    <h2 style="font-size: 11px; color: #94a3b8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 28px 0;">Financial Summary</h2>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 12px 0; color: #94a3b8; font-size: 15px; font-weight: 500;">Property</td>
                            <td style="padding: 12px 0; color: #010101; font-size: 15px; font-weight: 700; text-align: right;">${propertyName}</td>
                        </tr>
                        ${monthsPending > 1 ? `
                        <tr>
                            <td style="padding: 12px 0; color: #94a3b8; font-size: 15px; font-weight: 500;">Cycles Overdue</td>
                            <td style="padding: 12px 0; color: #dc2626; font-size: 16px; font-weight: 800; text-align: right;">${monthsPending} Months</td>
                        </tr>
                        ` : ''}
                        <tr style="border-top: 1.5px solid #f1f5f9;">
                            <td style="padding: 24px 0 12px 0; color: #0f172a; font-size: 18px; font-weight: 800;">Total Outstanding</td>
                            <td style="padding: 24px 0 12px 0; color: #dc2626; font-size: 32px; font-weight: 950; text-align: right;">₹${amount.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; color: #94a3b8; font-size: 15px; font-weight: 500;">Cycle Due Date</td>
                            <td style="padding: 12px 0; color: #010101; font-size: 16px; font-weight: 700; text-align: right;">${formattedDate} of the month</td>
                        </tr>
                    </table>
                </div>

                <!-- Action Button -->
                <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 22px 52px; border-radius: 18px; font-weight: 700; text-decoration: none; font-size: 16px; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.15); transition: all 0.3s ease;">
                        View Details & Pay Now
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                <div style="font-weight: 800; color: #6366f1; font-size: 20px; margin-bottom: 8px;">RentEase</div>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">Automated Financial Services by RentEase.</p>
                <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">&copy; ${new Date().getFullYear()} RentEase. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await sendMail(tenantEmail, subject, html);
        console.log(`✅ Rent Reminder sent to: ${tenantEmail} (${daysRemaining} days left)`);
    } catch (error) {
        console.error("❌ Error sending rent reminder:", error);
    }
};

module.exports = sendRentReminderEmail;
