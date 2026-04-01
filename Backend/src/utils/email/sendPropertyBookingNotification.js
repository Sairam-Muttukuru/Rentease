const sendMail = require("./sendMail");

async function sendPropertyBookingNotification(toEmail, details) {
    const {
        landlordName,
        tenantName,
        propertyName,
        propertyAddress,
        visitSlot,
        message,
        dashboardUrl
    } = details;

    const formattedDate = new Date(visitSlot).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = new Date(visitSlot).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6; border: 1px solid #eee; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #4f46e5; margin-bottom: 8px;">New Booking Request</h1>
                <p style="color: #666; font-size: 16px; margin-top: 0;">RentEase Property Management</p>
            </div>

            <p>Hello <strong>${landlordName}</strong>,</p>
            <p>You have received a new viewing request for your property: <strong>${propertyName}</strong>.</p>

            <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin: 25px 0; border: 1px solid #e2e8f0;">
                <h3 style="margin-top: 0; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Request Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Interested Tenant:</td>
                        <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${tenantName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Preferred Date:</td>
                        <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${formattedDate}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Preferred Time:</td>
                        <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${formattedTime}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Address:</td>
                        <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${propertyAddress}</td>
                    </tr>
                </table>
                
                ${message ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;"><strong>Message:</strong></p>
                    <p style="margin: 5px 0 0 0; font-style: italic; color: #475569;">"${message}"</p>
                </div>
                ` : ''}
            </div>

            <div style="text-align: center; margin-top: 35px;">
                <a href="${dashboardUrl}" style="background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
                    Review Booking in Dashboard
                </a>
            </div>

            <p style="margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                This is an automated notification from RentEase. Please do not reply to this email.
            </p>
        </div>
    `;

    try {
        await sendMail(toEmail, `New Booking Request: ${propertyName}`, htmlContent);
        console.log(`[Email] Booking notification sent to landlord: ${toEmail}`);
    } catch (error) {
        console.error(`[Email] Error sending booking notification to ${toEmail}:`, error.message);
    }
}

module.exports = sendPropertyBookingNotification;
