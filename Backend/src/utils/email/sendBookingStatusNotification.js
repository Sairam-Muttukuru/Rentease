const sendMail = require("./sendMail");

async function sendBookingStatusNotification(to, bookingDetails) {
    const {
        tenantName,
        propertyName,
        status,
        visitSlot,
        landlordName,
        propertyAddress
    } = bookingDetails;

    const isApproved = status === 'Approved';
    const color = isApproved ? '#10b981' : '#ef4444'; // Emerald or Red
    const title = isApproved ? 'Booking Approved! 🎉' : 'Booking Update';
    const message = isApproved
        ? `Great news! Your booking request has been accepted by the landlord.`
        : `Your booking request has been updated.`;

    let contentHtml = '';

    if (isApproved && visitSlot) {
        const date = new Date(visitSlot).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const time = new Date(visitSlot).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        contentHtml = `
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #166534; margin-top: 0;">Scheduled Visit</h3>
                <p style="margin: 5px 0; color: #15803d; font-size: 16px;"><strong>Date:</strong> ${date}</p>
                <p style="margin: 5px 0; color: #15803d; font-size: 16px;"><strong>Time:</strong> ${time}</p>
                <p style="margin-top: 15px; font-size: 14px; color: #166534;">Please arrive on time at the property location.</p>
            </div>
        `;
    } else if (status === 'Rejected') {
        contentHtml = `
            <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #991b1b; margin-top: 0;">Request Declined</h3>
                <p style="color: #b91c1c;">Unfortunately, the landlord is unable to accept your booking request at this time.</p>
            </div>
        `;
    }

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; border-bottom: 2px solid ${color}; padding-bottom: 20px; margin-bottom: 20px;">
                <img src="cid:renteasefavicon" alt="RentEase" style="height: 50px; margin-bottom: 10px;">
                <h1 style="color: ${color}; margin: 0;">${title}</h1>
                <p style="color: #666; font-size: 16px; margin-top: 10px;">Hi <strong>${tenantName}</strong>, ${message}</p>
            </div>

            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
                <h2 style="color: #1f2937; margin-top: 0;">Property Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Property:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #111827;">${propertyName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Address:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #111827;">${propertyAddress}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Landlord:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #111827;">${landlordName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Status:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: ${color};">${status}</td>
                    </tr>
                </table>
            </div>

            ${contentHtml}

            <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background-color: ${color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View My Bookings</a>
            </div>

            <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 30px;">
                Sent via RentEase Platform
            </p>
        </div>
    `;

    try {
        await sendMail(to, `Booking Update: ${propertyName} - ${status}`, htmlContent);
        console.log(`✅ Booking Status Email (${status}) sent to:`, to);
    } catch (error) {
        console.error("❌ Error sending booking status email:", error);
    }
}

module.exports = sendBookingStatusNotification;
