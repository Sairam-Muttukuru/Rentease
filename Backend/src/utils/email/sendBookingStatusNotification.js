const sendMail = require("./sendMail");

async function sendBookingStatusNotification(to, bookingDetails) {
    const {
        tenantName,
        propertyName,
        status,
        visitSlot,
        landlordName,
        propertyAddress,
        propertyImage
    } = bookingDetails;

    const upperStatus = status.toUpperCase();
    const isApproved = upperStatus === 'APPROVED' || upperStatus === 'CONFIRMED';
    const isRejected = upperStatus === 'REJECTED' || upperStatus === 'CANCELLED';
    const isRescheduled = upperStatus === 'RESCHEDULED';
    
    let color = '#3b82f6'; // Default Blue for informational/rescheduled
    let title = 'Booking Update';
    let message = 'Your booking request has been updated.';

    if (isApproved) {
        color = '#10b981'; // Emerald
        title = 'Booking Approved';
        message = 'Great news! Your booking request has been accepted by the landlord.';
    } else if (isRejected) {
        color = '#ef4444'; // Red
        title = 'Booking Declined';
        message = 'Your booking request has been declined by the landlord.';
    } else if (isRescheduled) {
        color = '#f59e0b'; // Amber
        title = 'Booking Rescheduled';
        message = 'Your booking has been rescheduled to a new time slot.';
    }

    let contentHtml = '';

    if ((isApproved || isRescheduled) && visitSlot) {
        const date = new Date(visitSlot).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const time = new Date(visitSlot).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        contentHtml = `
            <div style="background-color: ${isRescheduled ? '#fffbeb' : '#f0fdf4'}; border: 1px solid ${isRescheduled ? '#fde68a' : '#bbf7d0'}; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: ${isRescheduled ? '#b45309' : '#166534'}; margin-top: 0;">${isRescheduled ? 'New Time Slot' : 'Scheduled Visit'}</h3>
                <p style="margin: 5px 0; color: ${isRescheduled ? '#b45309' : '#15803d'}; font-size: 16px;"><strong>Date:</strong> ${date}</p>
                <p style="margin: 5px 0; color: ${isRescheduled ? '#b45309' : '#15803d'}; font-size: 16px;"><strong>Time:</strong> ${time}</p>
                <p style="margin-top: 15px; font-size: 14px; color: ${isRescheduled ? '#b45309' : '#166534'};">Please arrive on time at the property location.</p>
            </div>
        `;
    } else if (isRejected) {
        contentHtml = `
            <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #991b1b; margin-top: 0;">Request Declined</h3>
                <p style="color: #b91c1c;">Unfortunately, the landlord is unable to accept your booking request at this time.</p>
            </div>
        `;
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Outfit', sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            
            <!-- Logo Header (Table-based for Bulletproof Rendering) -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                <tr>
                    <td style="padding: 24px;">
                        <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="vertical-align: middle; padding-right: 12px;">
                                    <img src="cid:renteasefavicon" alt="RentEase" width="32" height="32" style="display: block; width: 32px; height: 32px; border-radius: 8px; object-fit: contain; background-color: #ffffff; padding: 2px;" />
                                </td>
                                <td style="vertical-align: middle;">
                                    <span style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; font-family: 'Outfit', sans-serif;">RentEase</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- Hero Section -->
            <div style="position: relative; height: 240px;">
                <img src="${propertyImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600'}" alt="Property" style="width: 100%; height: 100%; object-fit: cover;" />
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%);"></div>
                <div style="position: absolute; bottom: 24px; left: 24px;">
                    <span style="background: ${color}; color: white; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Booking ${status}</span>
                    <h1 style="color: white; margin: 12px 0 0 0; font-size: 28px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${title}</h1>
                </div>
            </div>

            <!-- Content Body -->
            <div style="padding: 40px 32px;">
                <p style="font-size: 16px; color: #475569; line-height: 1.7; margin: 0 0 32px 0;">
                    Hello <b>${tenantName}</b>,<br><br>
                    ${message}
                </p>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                    <h2 style="font-size: 12px; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 20px 0;">Property Details</h2>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Property</td>
                            <td style="padding: 10px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${propertyName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Address</td>
                            <td style="padding: 10px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${propertyAddress}</td>
                        </tr>
                        <tr style="border-top: 1px solid #e2e8f0;">
                            <td style="padding: 14px 0 10px 0; color: #64748b; font-size: 14px;">Landlord</td>
                            <td style="padding: 14px 0 10px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${landlordName}</td>
                        </tr>
                    </table>
                </div>

                ${contentHtml}

                <div style="text-align: center; margin-top: 48px;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background-color: ${color}; color: #ffffff; padding: 18px 36px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 16px; box-shadow: 0 8px 15px rgba(0,0,0,0.1);">
                        View My Bookings
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                <div style="font-weight: 800; color: #6366f1; font-size: 20px; margin-bottom: 8px;">RentEase</div>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">Sent with ♥ from the RentEase Team.</p>
                <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">&copy; ${new Date().getFullYear()} RentEase. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await sendMail(to, `Booking Update: ${propertyName} - ${status}`, htmlContent);
        console.log(`✅ Booking Status Email (${status}) sent to:`, to);
    } catch (error) {
        console.error("❌ Error sending booking status email:", error);
    }
}

module.exports = sendBookingStatusNotification;
