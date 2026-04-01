const sendMail = require("./sendMail");

const sendRentReminderEmail = async ({
    tenantEmail,
    tenantName,
    propertyName,
    dueDate,
    amount,
    daysRemaining
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

    if (daysRemaining === 0) {
        subject = `Friendly Reminder: Rent is Due Today!`;
        message = `This is a gentle reminder that your rent for <strong>${propertyName}</strong> is due <strong>today</strong>.`;
    } else if (daysRemaining === 1) {
        subject = `Reminder: Rent is Due Tomorrow`;
        message = `Just a quick heads-up that your rent for <strong>${propertyName}</strong> is due <strong>tomorrow</strong>.`;
    } else {
        subject = `Upcoming Rent Reminder: Due in ${daysRemaining} Days`;
        message = `We hope you're having a great week! This is a reminder that your rent for <strong>${propertyName}</strong> will be due in <strong>${daysRemaining} days</strong>.`;
    }

    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 40px auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); background-color: #ffffff;">
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 30px; text-align: center; color: white;">
                <img src="cid:renteasefavicon" alt="RentEase" style="height: 50px; margin-bottom: 10px; border-radius: 8px;">
                <h1 style="margin: 0; font-size: 26px; font-weight: 700;">Rent Reminder</h1>
            </div>
            <div style="padding: 40px 30px; background-color: #ffffff;">
                <h2 style="font-size: 22px; font-weight: 600; color: #111827; margin-top: 0; margin-bottom: 16px;">Hi ${tenantName},</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-top: 0; margin-bottom: 24px;">
                    ${message}
                </p>
                
                <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; color: #6b7280; font-size: 15px; width: 40%; vertical-align: top;">Property</td>
                            <td style="padding: 10px 0; font-weight: 600; color: #1f2937; font-size: 15px; width: 60%; text-align: right; vertical-align: top;">${propertyName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #6b7280; font-size: 15px; width: 40%; vertical-align: top;">Amount Due</td>
                            <td style="padding: 10px 0; font-weight: 700; color: #2563eb; font-size: 18px; width: 60%; text-align: right; vertical-align: top;">₹${amount}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #6b7280; font-size: 15px; width: 40%; vertical-align: top;">Due Date</td>
                            <td style="padding: 10px 0; font-weight: 600; color: #1f2937; font-size: 15px; width: 60%; text-align: right; vertical-align: top;">${formattedDate} of this month</td>
                        </tr>
                    </table>
                </div>

                <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.2s;">Pay Securely via RentEase</a>
                </div>
            </div>
            
            <div style="background-color: #f9fafb; padding: 24px; text-align: center; font-size: 13px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 8px 0; font-weight: 500;">RentEase Automated Reminders</p>
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} RentEase Home Management. All rights reserved.</p>
            </div>
        </div>
    `;

    try {
        await sendMail(tenantEmail, subject, html);
        console.log(`✅ Rent Reminder sent to: ${tenantEmail} (${daysRemaining} days left)`);
    } catch (error) {
        console.error("❌ Error sending rent reminder:", error);
    }
};

module.exports = sendRentReminderEmail;
