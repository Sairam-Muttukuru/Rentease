const nodemailer = require("nodemailer");
const path = require("path");

const sendLandlordPaymentEmail = async (landlordEmail, payment) => {
    const faviconPath = path.join(__dirname, "../../../../public/favicon.png");
    
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_ADMIN,
            pass: process.env.EMAIL_ADMIN_PASS
        }
    });

    await transporter.sendMail({
        from: `"RentEase" <${process.env.EMAIL_ADMIN}>`,
        to: landlordEmail,
        subject: `💰 Payment Received: ₹${payment.amount.toLocaleString()} for ${payment.property_title}`,
        html: `
            <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                <!-- Header with Logo -->
                <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 20px; text-align: center; color: white;">
                    <img src="cid:renteasefavicon" alt="RentEase" style="height: 60px; margin-bottom: 20px;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.025em;">Rent Received!</h1>
                    <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">Good news! Your account has been credited.</p>
                </div>

                ${payment.property_image ? `
                <div style="padding: 0; position: relative;">
                    <img src="${payment.property_image}" alt="Property" style="width: 100%; max-height: 240px; object-fit: cover; border-bottom: 4px solid #10b981;">
                </div>
                ` : ''}

                <div style="padding: 35px; background: #ffffff;">
                    <h2 style="color: #1e293b; margin-top: 0; font-size: 20px;">Dear ${payment.landlord_name},</h2>
                    <p style="color: #475569; line-height: 1.6; font-size: 15px;">
                        This is to confirm that you have received a rent payment for your property <b>${payment.property_title}</b> from <b>${payment.tenant_name}</b>.
                    </p>
                    
                    <div style="background: #f0fdf4; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #dcfce7;">
                        <h3 style="margin-top: 0; color: #15803d; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 15px;">Payment Details</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Property</td>
                                <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #1e293b; font-size: 14px;">${payment.property_title}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Tenant Name</td>
                                <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #1e293b; font-size: 14px;">${payment.tenant_name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Amount Received</td>
                                <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #059669; font-size: 20px;">₹${payment.amount.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td style="padding: 15px 0 0; color: #94a3b8; font-size: 12px;">Receipt Reference</td>
                                <td style="padding: 15px 0 0; text-align: right; font-size: 12px; color: #94a3b8;">${payment.receipt_number}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="http://localhost:5173/login" style="background: #059669; color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; display: inline-block;">View Transaction History</a>
                    </div>
                </div>

                <div style="background: #f1f5f9; padding: 25px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
                    <p style="margin-bottom: 8px; font-weight: 600; color: #475569;"> RentEase Home Management </p>
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} RentEase Inc. Sent with &hearts;</p>
                </div>
            </div>
        `,
        attachments: [
            {
                filename: 'favicon.png',
                path: faviconPath,
                cid: 'renteasefavicon'
            }
        ]
    });
};

module.exports = sendLandlordPaymentEmail;
