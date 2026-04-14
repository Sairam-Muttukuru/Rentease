const sendMail = require("./sendMail");

const sendTenantRemovalEmail = async ({
    tenantEmail,
    tenantName,
    landlordName,
    propertyName,
    propertyAddress
}) => {
    console.log("Preparing to send removal email to:", tenantEmail);

    const subject = `Update regarding your residency at ${propertyName} 🏠`;
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Residency Update</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            
            <!-- Logo Header -->
            <div style="padding: 24px; text-align: left; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px;">
                <img src="${process.env.FRONTEND_URL}/favicon.png" alt="RentEase" style="height: 32px; width: 32px; border-radius: 8px;" />
                <span style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">RentEase</span>
            </div>

            <!-- Content Body -->
            <div style="padding: 40px 32px;">
                <span style="background: #fee2e2; color: #dc2626; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Status Update</span>
                <h1 style="color: #0f172a; margin: 16px 0 24px 0; font-size: 28px; font-weight: 800;">Hello ${tenantName}, 👋</h1>
                
                <p style="font-size: 16px; color: #475569; line-height: 1.7; margin: 0 0 32px 0;">
                    This is to inform you that your residency record for <b>${propertyName}</b> has been officially updated and removed by your landlord, <b>${landlordName}</b>.
                </p>
                
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                    <h2 style="font-size: 12px; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 20px 0;">Removal Details</h2>
                    
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
                            <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Date</td>
                            <td style="padding: 14px 0 10px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${new Date().toLocaleDateString()}</td>
                        </tr>
                    </table>
                </div>

                <div style="background-color: #fff7ed; border-left: 4px solid #f97316; padding: 16px; border-radius: 8px; margin-bottom: 32px;">
                    <p style="margin: 0; font-size: 14px; color: #9a3412; line-height: 1.5;">
                        <b>Note:</b> Access to payment management and property documents through RentEase for this specific tenancy has been restricted.
                    </p>
                </div>

                <p style="font-size: 14px; color: #94a3b8; text-align: center;">
                    If you believe this update was made in error, please contact your landlord directly.
                </p>
            </div>
            
            <!-- Footer -->
            <div style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                <div style="font-weight: 800; color: #6366f1; font-size: 20px; margin-bottom: 8px;">RentEase</div>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">&copy; ${new Date().getFullYear()} RentEase Home Management. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `

    try {
        await sendMail(tenantEmail, subject, html);
        console.log(`✅ Removal Email sent to: ${tenantEmail}`);
    } catch (error) {
        console.error("❌ Error sending removal email:", error);
    }
};

module.exports = sendTenantRemovalEmail;
