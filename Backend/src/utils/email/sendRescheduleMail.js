const sendMail = require("./sendMail");

module.exports = async (email, customerName, serviceName, providerName, newDate, startTime, endTime, reason) => {
    try {
        const formatTime = (t) => {
            if (!t) return "";
            const [h, m] = t.split(':');
            const hours = parseInt(h);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            return `${hours % 12 || 12}:${m} ${ampm}`;
        };

        const formattedDate = new Date(newDate).toLocaleDateString(undefined, {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        const subject = `⚠️ Service Visit Rescheduled – ${serviceName}`;
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Visit Rescheduled</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
                
                <!-- Logo Header -->
                <div style="padding: 24px; text-align: left; background: #ffffff; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px;">
                    <img src="${process.env.FRONTEND_URL}/favicon.png" alt="RentEase" style="height: 32px; width: 32px; border-radius: 8px;" />
                    <span style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">RentEase</span>
                </div>

                <!-- Update Header Section -->
                <div style="background: linear-gradient(to right, #f59e0b, #d97706); padding: 40px; text-align: center; color: #ffffff;">
                    <div style="background: rgba(255,255,255,0.2); width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                        <span style="font-size: 32px;">🔄</span>
                    </div>
                    <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Visit Rescheduled</h1>
                    <p style="margin: 8px 0 0; opacity: 0.9; font-size: 16px;">Your service appointment has been updated</p>
                </div>

                <!-- Content Body -->
                <div style="padding: 40px 32px;">
                    <p style="font-size: 16px; color: #475569; line-height: 1.7; margin: 0 0 32px 0;">
                        Hi <b>${customerName}</b>,<br><br>
                        Your service provider <b>${providerName}</b> has updated the appointment for <b>${serviceName}</b>. Please check the new timing below.
                    </p>
                    
                    <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                        <h2 style="font-size: 11px; color: #92400e; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px 0;">Reason for Change</h2>
                        <p style="font-size: 15px; color: #78350f; line-height: 1.6; margin: 0; font-style: italic;">
                            "${reason || 'No specific reason provided by the provider.'}"
                        </p>
                    </div>

                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                        <h2 style="font-size: 12px; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 20px 0;">New Appointment Details</h2>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Provider</td>
                                <td style="padding: 10px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${providerName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">New Date</td>
                                <td style="padding: 10px 0; color: #f59e0b; font-size: 14px; font-weight: 800; text-align: right;">${formattedDate}</td>
                            </tr>
                            <tr style="border-top: 1px solid #e2e8f0;">
                                <td style="padding: 14px 0 10px 0; color: #64748b; font-size: 14px;">Time Window</td>
                                <td style="padding: 14px 0 10px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${formatTime(startTime)} - ${formatTime(endTime)}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="text-align: center;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 18px 40px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                            View My Dashboard
                        </a>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                    <div style="font-weight: 800; color: #6366f1; font-size: 20px; margin-bottom: 8px;">RentEase</div>
                    <p style="font-size: 12px; color: #94a3b8; margin: 0;">We apologize for any inconvenience caused.</p>
                    <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">&copy; ${new Date().getFullYear()} RentEase. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        await sendMail(email, subject, htmlContent);
        console.log(`✅ Reschedule email sent to ${email}`);
    } catch (err) {
        console.error(`❌ Failed to send reschedule mail:`, err.message);
    }
};
