const sendMail = require("./sendMail");

const sendLandlordPaymentEmail = async (landlordEmail, payment) => {
    const subject = `💰 Payment Received: ₹${payment.amount.toLocaleString()} for ${payment.property_title}`;
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Received</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            
            <!-- Logo Header -->
            <div style="padding: 24px; text-align: left; background: #ffffff; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px;">
                <img src="${process.env.FRONTEND_URL}/favicon.png" alt="RentEase" style="height: 32px; width: 32px; border-radius: 8px;" />
                <span style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">RentEase</span>
            </div>

            <!-- Hero Image -->
            ${payment.property_image ? `
            <div style="position: relative; height: 200px;">
                <img src="${payment.property_image}" alt="Property" style="width: 100%; height: 100%; object-fit: cover;" />
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%);"></div>
            </div>
            ` : ''}

            <!-- Success Header Section -->
            <div style="background: linear-gradient(to right, #059669, #10b981); padding: 40px; text-align: center; color: #ffffff;">
                <div style="background: rgba(255,255,255,0.2); width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                    <span style="font-size: 32px;">💰</span>
                </div>
                <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Rent Received!</h1>
                <p style="margin: 8px 0 0; opacity: 0.9; font-size: 16px;">Good news! Your account has been credited.</p>
            </div>

            <!-- Content Body -->
            <div style="padding: 40px 32px;">
                <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0;">Dear ${payment.landlord_name},</h2>
                <p style="font-size: 16px; color: #475569; line-height: 1.7; margin: 0 0 32px 0;">
                    This is to confirm that you have received a rent payment for your property <b>${payment.property_title}</b> from <b>${payment.tenant_name}</b>.
                </p>
                
                <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                    <h2 style="font-size: 11px; color: #15803d; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 20px 0;">Payment Transaction Summary</h2>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Tenant</td>
                            <td style="padding: 10px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${payment.tenant_name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Receipt Ref</td>
                            <td style="padding: 10px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">#${payment.receipt_number}</td>
                        </tr>
                        <tr style="border-top: 1px solid #dcfce7;">
                            <td style="padding: 14px 0 10px 0; color: #64748b; font-size: 14px;">Amount Received</td>
                            <td style="padding: 14px 0 10px 0; color: #059669; font-size: 22px; font-weight: 800; text-align: right;">₹${payment.amount.toLocaleString()}</td>
                        </tr>
                    </table>
                </div>

                <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 18px 40px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                        View History
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                <div style="font-weight: 800; color: #6366f1; font-size: 20px; margin-bottom: 8px;">RentEase</div>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">Simplifying your property finances.</p>
                <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">&copy; ${new Date().getFullYear()} RentEase Inc. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await sendMail(landlordEmail, subject, html);
        console.log(`✅ Landlord payment email sent to: ${landlordEmail}`);
    } catch (error) {
        console.error("❌ Error sending landlord payment email:", error);
    }
};

module.exports = sendLandlordPaymentEmail;
