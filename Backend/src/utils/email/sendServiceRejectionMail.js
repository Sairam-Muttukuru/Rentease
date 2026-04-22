const sendMail = require("./sendMail");

module.exports = async (email, tenantName, serviceName, providerName, rejectionReason) => {
  try {
    const subject = `❌ Service Request Rejected: ${serviceName}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Service Update</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Outfit', sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
            
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

            <!-- Content Body -->
            <div style="padding: 40px 32px;">
                <span style="background: #fee2e2; color: #dc2626; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Request Update</span>
                <h1 style="color: #0f172a; margin: 16px 0 24px 0; font-size: 28px; font-weight: 800;">Hi ${tenantName}, 👋</h1>
                
                <p style="font-size: 16px; color: #475569; line-height: 1.7; margin: 0 0 32px 0;">
                    We're writing to inform you that your request for <b>${serviceName}</b> could not be accepted by <b>${providerName}</b> at this time.
                </p>
                
                <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                    <h2 style="font-size: 11px; color: #e11d48; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px 0;">Reason for Rejection</h2>
                    <p style="font-size: 15px; color: #9f1239; line-height: 1.6; margin: 0; font-style: italic;">
                        "${rejectionReason || "No specific reason was provided by the professional."}"
                    </p>
                </div>

                <p style="font-size: 15px; color: #64748b; margin-bottom: 32px;">
                    Don't worry—you can easily browse and book other highly-rated professionals on the RentEase platform to get your issue resolved.
                </p>

                <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 18px 40px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                        Browse Other Professionals
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                <div style="font-weight: 800; color: #6366f1; font-size: 20px; margin-bottom: 8px;">RentEase</div>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">We're here to help you manage your home better.</p>
                <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">&copy; ${new Date().getFullYear()} RentEase. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    await sendMail(email, subject, htmlContent);
    console.log(`❌ Service rejection email sent to ${email}`);
  } catch (err) {
    console.error(`❌ Failed to send service rejection email to ${email}:`, err.message);
  }
};

