const sendMail = require("./sendMail");

const sendTenantServiceBookingEmail = async (email, details) => {
    try {
        const {
            tenantName,
            serviceName,
            providerName,
            scheduledDate,
            scheduledTime,
            amount,
            paymentMethod,
            address
        } = details;

        const subject = `🗓️ Booking Confirmed: ${serviceName}`;
        const isCOD = paymentMethod === 'COD';

        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Confirmed</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Outfit', sans-serif;">
            <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #6366f1, #4f46e5); padding: 40px; text-align: center; color: #ffffff;">
                    <div style="background: rgba(255,255,255,0.2); width: 64px; height: 64px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 32px;">
                        ✨
                    </div>
                    <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Booking Confirmed!</h1>
                    <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">We've scheduled your ${serviceName}</p>
                </div>

                <!-- Body -->
                <div style="padding: 40px 32px;">
                    <p style="font-size: 16px; color: #475569; line-height: 1.7; margin: 0 0 32px 0;">
                        Hi <b>${tenantName}</b>,<br><br>
                        Great news! Your service request for <b>${serviceName}</b> has been received and confirmed. Our partner <b>${providerName}</b> will visit your location as scheduled.
                    </p>

                    <!-- Details Card -->
                    <div style="background-color: #f1f5f9; border-radius: 20px; padding: 24px; margin-bottom: 32px;">
                        <h2 style="font-size: 11px; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 20px 0;">Schedule Details</h2>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="padding-bottom: 12px; color: #64748b; font-size: 14px;">Date & Time</td>
                                <td style="padding-bottom: 12px; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${scheduledDate} at ${scheduledTime}</td>
                            </tr>
                            <tr>
                                <td style="padding-bottom: 12px; color: #64748b; font-size: 14px;">Location</td>
                                <td style="padding-bottom: 12px; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${address}</td>
                            </tr>
                            <tr>
                                <td style="padding-bottom: 12px; color: #64748b; font-size: 14px;">Amount</td>
                                <td style="padding-bottom: 12px; color: #4f46e5; font-size: 16px; font-weight: 800; text-align: right;">₹${amount}</td>
                            </tr>
                            <tr style="border-top: 1px solid #cbd5e1;">
                                <td style="padding-top: 12px; color: #64748b; font-size: 14px;">Payment Method</td>
                                <td style="padding-top: 12px; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${paymentMethod}</td>
                            </tr>
                        </table>
                    </div>

                    ${isCOD ? `
                    <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 16px; padding: 20px; margin-bottom: 32px;">
                        <div style="display: flex; align-items: flex-start; gap: 12px;">
                            <span style="font-size: 20px;">💵</span>
                            <div>
                                <h3 style="margin: 0 0 5px 0; font-size: 14px; color: #92400e; font-weight: 800;">Cash on Delivery Instructions</h3>
                                <p style="margin: 0; font-size: 13px; color: #b45309; line-height: 1.5;">
                                    Please ensure you have <b>₹${amount}</b> in cash ready to pay the service provider once the job is completed.
                                </p>
                            </div>
                        </div>
                    </div>
                    ` : `
                    <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 16px; padding: 20px; margin-bottom: 32px;">
                        <p style="margin: 0; font-size: 14px; color: #166534; font-weight: 600; text-align: center;">
                            Payment will be handled securely through our online portal after completion.
                        </p>
                    </div>
                    `}

                    <div style="text-align: center;">
                        <p style="font-size: 12px; color: #94a3b8; margin-bottom: 20px;">Need to cancel or reschedule? Log in to your dashboard.</p>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 16px 36px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 14px;">
                            View My Bookings
                        </a>
                    </div>
                </div>

                <!-- Footer -->
                <div style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                    <div style="font-weight: 800; color: #4f46e5; font-size: 18px; margin-bottom: 8px;">RentEase</div>
                    <p style="font-size: 12px; color: #94a3b8; margin: 0;">&copy; ${new Date().getFullYear()} RentEase Home Services. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        await sendMail(email, subject, html);
        console.log(`✅ Tenant booking confirmation sent to ${email}`);
    } catch (err) {
        console.error(`❌ Failed to send tenant booking email:`, err.message);
    }
};

module.exports = sendTenantServiceBookingEmail;
