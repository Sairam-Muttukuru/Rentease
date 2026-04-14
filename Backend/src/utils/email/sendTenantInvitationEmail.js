const sendMail = require("./sendMail");

const sendTenantInvitationEmail = async ({
    tenantEmail,
    tenantName,
    landlordName,
    propertyName,
    propertyAddress,
    monthlyRent,
    startDate,
    rentDueDate,
    propertyImageUrl
}) => {
    console.log("Preparing to send email to:", tenantEmail);

    const getDaySuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    // Safely extract day from YYYY-MM-DD string to avoid timezone shifts
    let dueDay = rentDueDate;
    if (typeof rentDueDate === 'string' && rentDueDate.includes('-')) {
        dueDay = parseInt(rentDueDate.split('-')[2], 10);
    }

    const formattedRentDate = `${dueDay}${getDaySuffix(dueDay)} of every month`;

    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to RentEase</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
                
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

            <!-- Hero Image Section -->
            <div style="height: 240px; background-color: #f1f5f9; overflow: hidden; position: relative;">
                <img src="${propertyImageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600'}" alt="Property" width="600" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%);"></div>
                <div style="position: absolute; bottom: 24px; left: 24px;">
                    <span style="background: #4f46e5; color: white; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Invitation Received</span>
                    <h1 style="color: white; margin: 12px 0 0 0; font-size: 28px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Welcome Home! 👋</h1>
                </div>
            </div>

                <!-- Content Body -->
                <div style="padding: 40px 32px;">
                    <p style="font-size: 16px; color: #475569; line-height: 1.7; margin: 0 0 32px 0;">
                        Hello <b>${tenantName}</b>,<br><br>
                        We're absolutely delighted to welcome you! Your landlord, <b>${landlordName}</b>, has officially invited you to join <b>${propertyName}</b> on the RentEase platform.
                    </p>

                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                        <h2 style="font-size: 12px; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 20px 0;">Lease Overview</h2>
                        
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
                                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Monthly Rent</td>
                                <td style="padding: 14px 0 10px 0; color: #10b981; font-size: 18px; font-weight: 900; text-align: right;">₹${Number(monthlyRent).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Starts On</td>
                                <td style="padding: 10px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${new Date(startDate).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Rent Due</td>
                                <td style="padding: 10px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${formattedRentDate}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="text-align: center;">
                        <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 18px 36px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 16px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);">
                            Accept Invitation & Login
                        </a>
                        <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">Manage rent, maintenance, and documents in one place.</p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="font-size: 12px; color: #94a3b8; margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} RentEase Ecosystem. All rights reserved.</p>
                    <p style="font-size: 11px; color: #cbd5e1;">Sent with ♥ from the RentEase Team.</p>
                </div>
            </div>
        </body>
        </html>
        `

    try {
        await sendMail(tenantEmail, `Welcome Home! You've been invited to ${propertyName} 🏠`, html);
        console.log(`✅ Invitation Email sent to: ${tenantEmail}`);
    } catch (error) {
        console.error("❌ Error sending invitation email:", error);
    }
};

module.exports = sendTenantInvitationEmail;

