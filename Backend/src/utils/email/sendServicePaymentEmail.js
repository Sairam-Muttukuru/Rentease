const sendMail = require("./sendMail");

/**
 * Sends a professional "Payment Received" email to the Service Provider.
 * @param {string} providerEmail
 * @param {object} data - { provider_name, payer_name, service_name, amount, receipt_number, payment_date, property_address }
 */
const sendServicePaymentEmail = async (providerEmail, data) => {
    const {
        provider_name = 'Service Provider',
        payer_name = 'Customer',
        service_name = 'Service',
        amount = 0,
        receipt_number = 'N/A',
        payment_date = new Date(),
        property_address = 'N/A'
    } = data;

    const formattedDate = new Date(payment_date).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
    const formattedAmount = Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 });

    const isPayer = data.type === 'payer';
    
    // Choose Banner & Text based on role
    const bannerColor = isPayer ? '#6366f1' : '#059669';
    const bannerGradient = isPayer 
        ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' 
        : 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
    const greeting = isPayer ? `Hi ${payer_name}` : `Hi ${provider_name}`;
    const mainTitle = isPayer ? "Payment Confirmed!" : "You've Been Paid!";
    const subTitle = isPayer 
        ? "Your service payment has been processed successfully." 
        : "A service payment has been received and credited to your account.";
    const statusTag = isPayer ? "💳 Payment Successful" : "💰 Payment Received";

    const subject = isPayer 
        ? `✅ Payment Receipt: ₹${formattedAmount} for ${service_name}`
        : `💰 Payment Received: ₹${formattedAmount} from ${payer_name}`;

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet">
        <title>${isPayer ? 'Payment Receipt' : 'Payment Received'}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Outfit', sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            
            <!-- Header -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: ${bannerGradient};">
                <tr>
                    <td style="padding: 40px 40px 32px 40px;">
                        <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="vertical-align: middle; padding-right: 14px;">
                                    <img src="cid:renteasefavicon" alt="RentEase" width="38" height="38" style="display: block; width: 38px; height: 38px; border-radius: 10px; object-fit: contain; background-color: #ffffff; padding: 2px;" />
                                </td>
                                <td style="vertical-align: middle;">
                                    <span style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; font-family: 'Outfit', sans-serif;">RentEase</span>
                                </td>
                            </tr>
                        </table>
                        <div style="margin-top: 32px;">
                            <div style="display: inline-block; background: rgba(255,255,255,0.2); color: #ffffff; padding: 6px 16px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px;">
                                ${statusTag}
                            </div>
                            <h1 style="color: #ffffff; margin: 0; font-size: 30px; font-weight: 900; letter-spacing: -0.5px;">${mainTitle}</h1>
                            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0 0; font-size: 15px;">${subTitle}</p>
                        </div>
                    </td>
                </tr>
            </table>

            <!-- Amount Banner -->
            <div style="background: ${isPayer ? '#f0f9ff' : '#f0fdf4'}; border-bottom: 1px solid ${isPayer ? '#bae6fd' : '#bbf7d0'}; padding: 28px 40px; text-align: center;">
                <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: ${bannerColor};">${isPayer ? 'Amount Paid' : 'Amount Received'}</p>
                <p style="margin: 0; font-size: 48px; font-weight: 900; color: ${isPayer ? '#1e3a8a' : '#065f46'}; letter-spacing: -2px;">₹${formattedAmount}</p>
                <p style="margin: 8px 0 0 0; font-size: 13px; color: #6b7280;">Receipt #${receipt_number}</p>
            </div>

            <!-- Content -->
            <div style="padding: 36px 40px;">
                <p style="font-size: 16px; color: #374151; line-height: 1.7; margin: 0 0 28px 0;">
                    ${greeting},<br><br>
                    ${isPayer 
                        ? `Thank you for your payment. Your professional service booking for <strong>${service_name}</strong> has been successfully settled with <strong>${provider_name}</strong>.`
                        : `Great news! <strong>${payer_name}</strong> has successfully completed the online payment for your service. The funds will be settled as per your payment agreement.`
                    }
                </p>

                <!-- Transaction Details -->
                <div style="background: #f8fafc; border-radius: 16px; padding: 28px; border: 1px solid #e2e8f0; margin-bottom: 28px;">
                    <p style="margin: 0 0 20px 0; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #6366f1;">Transaction Details</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td style="padding-bottom: 14px; color: #6b7280; font-size: 14px; width: 40%;">Service</td>
                            <td style="padding-bottom: 14px; font-weight: 700; color: #111827; font-size: 14px; text-align: right;">${service_name}</td>
                        </tr>
                        <tr>
                            <td style="padding-bottom: 14px; color: #6b7280; font-size: 14px;">${isPayer ? 'Service Provider' : 'Paid By'}</td>
                            <td style="padding-bottom: 14px; font-weight: 700; color: #111827; font-size: 14px; text-align: right;">${isPayer ? provider_name : payer_name}</td>
                        </tr>
                        <tr>
                            <td style="padding-bottom: 14px; color: #6b7280; font-size: 14px;">Location</td>
                            <td style="padding-bottom: 14px; font-weight: 700; color: #111827; font-size: 14px; text-align: right;">${property_address}</td>
                        </tr>
                        <tr>
                            <td style="padding-bottom: 14px; color: #6b7280; font-size: 14px;">Payment Date</td>
                            <td style="padding-bottom: 14px; font-weight: 700; color: #111827; font-size: 14px; text-align: right;">${formattedDate}</td>
                        </tr>
                        <tr style="border-top: 1px dashed #cbd5e1;">
                            <td style="padding-top: 14px; font-weight: 800; color: #111827; font-size: 15px;">Total ${isPayer ? 'Paid' : 'Received'}</td>
                            <td style="padding-top: 14px; font-weight: 900; color: ${bannerColor}; font-size: 22px; text-align: right;">₹${formattedAmount}</td>
                        </tr>
                    </table>
                </div>

                <!-- Info Note -->
                <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px 20px;">
                    <p style="margin: 0; font-size: 13px; color: #1e40af; font-weight: 600; line-height: 1.6;">
                        📋 ${isPayer ? "You can download your detailed receipt from the RentEase Dashboard anytime." : "A digital record of this transaction has been saved to your provider profile."}
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div style="padding: 28px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                <div style="font-weight: 900; color: #6366f1; font-size: 20px; margin-bottom: 6px;">RentEase</div>
                <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Smart Property Management Solutions</p>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">&copy; ${new Date().getFullYear()} RentEase Home Management. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    await sendMail(providerEmail, subject, html);
};

module.exports = sendServicePaymentEmail;
