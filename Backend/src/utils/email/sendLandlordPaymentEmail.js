const sendMail = require("./sendMail");

const sendLandlordPaymentEmail = async (landlordEmail, payment) => {
    const subject = `💰 Rent Received: ₹${Number(payment.amount).toLocaleString()} — ${payment.property_title}`;

    const paymentDate = new Date(payment.payment_date || new Date()).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rent Payment Received</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f1f5f9;font-family: 'Outfit', sans-serif;">

        <div style="max-width:620px;margin:40px auto 40px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.08);border:1px solid #e2e8f0;">

            <!-- ────────────── HEADER / LOGO ────────────── -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-bottom:1px solid #f1f5f9;">
                <tr>
                    <td style="padding:22px 28px;">
                        <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="vertical-align:middle;padding-right:10px;">
                                    <img src="cid:renteasefavicon" alt="RentEase" width="36" height="36"
                                        style="display:block;width:36px;height:36px;border-radius:10px; object-fit: contain; background-color: #ffffff; padding: 2px;" />
                                </td>
                                <td style="vertical-align:middle;">
                                    <span style="font-size:22px;font-weight:900;color:#0f172a;letter-spacing:-0.8px;font-family: 'Outfit', sans-serif;">RentEase</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td style="padding:22px 28px;text-align:right;">
                        <span style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;">Landlord Notification</span>
                    </td>
                </tr>
            </table>

            <!-- ────────────── HERO BANNER ────────────── -->
            ${payment.property_image ? `
            <div style="position:relative;height:220px;overflow:hidden;background:#1e293b;">
                <img src="${payment.property_image}" alt="${payment.property_title}" width="620"
                    style="width:100%;height:100%;object-fit:cover;display:block;opacity:0.85;" />
                <div style="position:absolute;inset:0;background:linear-gradient(160deg,rgba(15,23,42,0.3) 0%,rgba(15,23,42,0.75) 100%);"></div>
                <div style="position:absolute;bottom:24px;left:28px;right:28px;">
                    <span style="display:inline-block;background:#10b981;color:#ffffff;padding:5px 14px;border-radius:20px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;">✓ Payment Received</span>
                    <h2 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.3px;line-height:1.3;">${payment.property_title}</h2>
                </div>
            </div>
            ` : `
            <div style="background:linear-gradient(135deg,#1e293b 0%,#334155 100%);padding:40px 28px 32px;">
                <span style="display:inline-block;background:#10b981;color:#ffffff;padding:5px 14px;border-radius:20px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;">✓ Payment Received</span>
                <h2 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;">${payment.property_title}</h2>
            </div>
            `}

            <!-- ────────────── AMOUNT HIGHLIGHT ────────────── -->
            <div style="background:linear-gradient(135deg,#059669 0%,#10b981 100%);padding:32px 28px;text-align:center;">
                <p style="margin:0 0 6px;color:rgba(255,255,255,0.8);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Amount Credited</p>
                <div style="font-size:52px;font-weight:900;color:#ffffff;letter-spacing:-2px;line-height:1;">₹${Number(payment.amount).toLocaleString()}</div>
                <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:13px;font-weight:500;">${paymentDate}</p>
            </div>

            <!-- ────────────── BODY ────────────── -->
            <div style="padding:40px 32px;">

                <p style="margin:0 0 8px;font-size:20px;font-weight:800;color:#0f172a;">Dear ${payment.landlord_name},</p>
                <p style="margin:0 0 32px;font-size:15px;color:#64748b;line-height:1.75;">
                    Great news! A rent payment has been successfully received and credited to your account for property
                    <strong style="color:#0f172a;">${payment.property_title}</strong> from tenant
                    <strong style="color:#0f172a;">${payment.tenant_name}</strong>.
                </p>

                <!-- Transaction Summary Card -->
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:28px;margin-bottom:28px;">
                    <p style="margin:0 0 20px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#64748b;">Transaction Summary</p>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
                                <span style="font-size:13px;color:#64748b;font-weight:500;">Tenant</span>
                            </td>
                            <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;">
                                <span style="font-size:13px;color:#0f172a;font-weight:700;">${payment.tenant_name}</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
                                <span style="font-size:13px;color:#64748b;font-weight:500;">Payment Date</span>
                            </td>
                            <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;">
                                <span style="font-size:13px;color:#0f172a;font-weight:700;">${paymentDate}</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
                                <span style="font-size:13px;color:#64748b;font-weight:500;">Receipt Reference</span>
                            </td>
                            <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;">
                                <span style="font-size:13px;color:#6366f1;font-weight:800;font-family:monospace;">#${payment.receipt_number || 'N/A'}</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:14px 0 0;">
                                <span style="font-size:15px;color:#0f172a;font-weight:700;">Total Amount Received</span>
                            </td>
                            <td style="padding:14px 0 0;text-align:right;">
                                <span style="font-size:22px;color:#059669;font-weight:900;">₹${Number(payment.amount).toLocaleString()}</span>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Status Badge -->
                <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px 20px;margin-bottom:32px;display:flex;align-items:center;gap:12px;">
                    <span style="font-size:20px;">✅</span>
                    <p style="margin:0;font-size:13px;color:#15803d;font-weight:600;line-height:1.5;">
                        Your bank account has been credited. You can view the full transaction history and download receipts from your landlord dashboard.
                    </p>
                </div>

                <!-- CTA Button -->
                <div style="text-align:center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login"
                        style="display:inline-block;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#ffffff;padding:16px 44px;border-radius:14px;font-weight:800;font-size:15px;text-decoration:none;letter-spacing:-0.3px;box-shadow:0 10px 30px rgba(99,102,241,0.35);">
                        View Dashboard →
                    </a>
                </div>
            </div>

            <!-- ────────────── FOOTER ────────────── -->
            <div style="padding:28px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
                <p style="margin:0 0 4px;font-size:16px;font-weight:900;color:#6366f1;letter-spacing:-0.5px;">RentEase</p>
                <p style="margin:0 0 16px;font-size:11px;color:#94a3b8;font-weight:500;">Smart Property Management — Simplified</p>
                <p style="margin:0;font-size:11px;color:#cbd5e1;">© ${new Date().getFullYear()} RentEase Inc. All rights reserved.</p>
                <p style="margin:8px 0 0;font-size:10px;color:#e2e8f0;color:#94a3b8;">This is an automated notification. Please do not reply to this email.</p>
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
