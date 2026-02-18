const nodemailer = require("nodemailer");

async function sendServiceRequestNotification(to, requestDetails) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const {
        serviceName,
        providerName,
        tenantName,
        contactNumber,
        address,
        scheduledDate,
        scheduledTime,
        propertyImage
    } = requestDetails;

    // Construct image HTML if propertyImage exists
    const imageHtml = propertyImage
        ? `<div style="margin-top: 20px;">
             <h3>Property Reference Image</h3>
             <img src="${propertyImage}" alt="Property Image" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #ddd;" />
           </div>`
        : '';

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 20px;">
                <h1 style="color: #6366f1; margin: 0;">New Service Request</h1>
                <p style="color: #666; font-size: 16px;">Hello <strong>${providerName}</strong>, you have a new booking!</p>
            </div>

            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
                <h2 style="color: #1f2937; margin-top: 0;">Booking Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Service:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #111827;">${serviceName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Scheduled For:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #111827;">${scheduledDate} at ${scheduledTime}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Location:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #111827;">${address}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Client Name:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #111827;">${tenantName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Contact:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #111827;">${contactNumber || 'Not Provided'}</td>
                    </tr>
                </table>
            </div>

            ${imageHtml}

            <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/provider/dashboard" style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Request</a>
            </div>

            <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 30px;">
                Sent via RentEase Platform
            </p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"RentEase Notifications" <${process.env.EMAIL_USER}>`,
            to,
            subject: `New Service Request: ${serviceName}`,
            html: htmlContent
        });
        console.log("✅ Service Notification Email sent to:", to);
    } catch (error) {
        console.error("❌ Error sending notification email:", error);
    }
}

module.exports = sendServiceRequestNotification;
