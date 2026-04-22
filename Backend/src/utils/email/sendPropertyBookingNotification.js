const sendMail = require("./sendMail");

async function sendPropertyBookingNotification(toEmail, details) {
    const {
        landlordName,
        tenantName,
        propertyName,
        propertyAddress,
        visitSlot,
        message,
        dashboardUrl,
        propertyImage
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
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Request</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Outfit', sans-serif;">
        <div style="max-width: 620px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
            
            <!-- Logo Header (Table-based for Bulletproof Rendering) -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                <tr>
                    <td style="padding: 24px;">
                        <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="vertical-align: middle; padding-right: 12px;">
                                    <img src="cid:renteasefavicon" alt="Logo" width="32" height="32" style="display: block; width: 32px; height: 32px; border-radius: 8px; object-fit: contain; background-color: #ffffff; padding: 2px;" />
                                </td>
                                <td style="vertical-align: middle;">
                                    <span style="font-size: 22px; font-weight: 800; color: #010101; letter-spacing: -0.5px; font-family: 'Outfit', sans-serif;">RentEase</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- Property Hero Section -->
            <div style="height: 240px; background-color: #f1f5f9; overflow: hidden; position: relative;">
                <img src="${propertyImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600'}" alt="Property" width="600" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%);"></div>
                <div style="position: absolute; bottom: 24px; left: 24px;">
                    <span style="background: #6366f1; color: white; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; display: inline-block;">
                        Booking Request Received
                    </span>
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">New Interest! 🏠</h1>
                </div>
            </div>

            <!-- Content Body -->
            <div style="padding: 40px 32px;">
                <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0;">Hello ${landlordName},</h2>
                <p style="font-size: 16px; color: #475569; line-height: 1.7; margin: 0 0 32px 0;">
                    Good news! You have received a new viewing request for <b>${propertyName}</b>. Please review the tenant's details and preferred slot.
                </p>
                
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                    <h2 style="font-size: 11px; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 20px 0;">Request Breakdown</h2>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Interested Tenant</td>
                            <td style="padding: 10px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${tenantName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Visit Date</td>
                            <td style="padding: 10px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${formattedDate}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Preferred Time</td>
                            <td style="padding: 10px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${formattedTime}</td>
                        </tr>
                        <tr style="border-top: 1px solid #e2e8f0;">
                            <td style="padding: 14px 0 10px 0; color: #64748b; font-size: 14px;">Property Address</td>
                            <td style="padding: 14px 0 10px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${propertyAddress}</td>
                        </tr>
                    </table>
                    
                    ${message ? `
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px dashed #cbd5e1;">
                        <span style="font-size: 11px; color: #64748b; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 8px;">Tenant's Message</span>
                        <p style="margin: 0; font-size: 15px; font-style: italic; color: #475569; line-height: 1.6;">"${message}"</p>
                    </div>
                    ` : ''}
                </div>

                <div style="text-align: center;">
                    <a href="${dashboardUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 18px 40px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                        Review Request
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                <div style="font-weight: 800; color: #6366f1; font-size: 20px; margin-bottom: 8px;">RentEase</div>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">Managing properties, masterfully.</p>
                <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">&copy; ${new Date().getFullYear()} RentEase. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await sendMail(toEmail, `New Booking Request: ${propertyName}`, htmlContent);
        console.log(`[Email] Booking notification sent to landlord: ${toEmail}`);
    } catch (error) {
        console.error(`[Email] Error sending booking notification to ${toEmail}:`, error.message);
    }
}

module.exports = sendPropertyBookingNotification;
