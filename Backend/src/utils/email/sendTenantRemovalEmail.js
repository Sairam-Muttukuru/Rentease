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
        <style>
            body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; color: #1f2937; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center; color: white; }
            .content { padding: 40px 30px; }
            .greeting { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px; }
            .message { font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; }
            
            .property-card { background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; padding: 24px; margin-bottom: 32px; }
            .card-header { font-size: 18px; font-weight: 600; color: #991b1b; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #fee2e2; }
            
            .details-table { width: 100%; border-collapse: collapse; }
            .details-table td { padding: 10px 0; vertical-align: top; }
            .label-cell { color: #991b1b; font-weight: 500; width: 40%; padding-right: 15px; opacity: 0.8; }
            .value-cell { color: #7f1d1d; font-weight: 600; text-align: right; width: 60%; }
            
            .footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 13px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="cid:renteasefavicon" alt="RentEase" style="height: 50px; margin-bottom: 10px;">
                <h1 style="margin:0; font-size: 28px;">Notice of Removal</h1>
            </div>
            <div class="content">
                <h1 class="greeting">Hello ${tenantName},</h1>
                
                <p class="message">
                    This email is to inform you that your tenancy record for <strong>${propertyName}</strong> has been removed from our system by your landlord, <strong>${landlordName}</strong>.
                    <br><br>
                    Consequently, you will no longer be able to manage payments or requests for this property through your RentEase dashboard.
                </p>
                
                <div class="property-card">
                    <div class="card-header">Property Information</div>
                    
                    <table class="details-table">
                        <tr>
                            <td class="label-cell">Property Name</td>
                            <td class="value-cell">${propertyName}</td>
                        </tr>
                        <tr>
                            <td class="label-cell">Address</td>
                            <td class="value-cell">${propertyAddress}</td>
                        </tr>
                        <tr>
                            <td class="label-cell">Removal Date</td>
                            <td class="value-cell">${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        </tr>
                    </table>
                </div>

                <p class="message" style="font-size: 14px; text-align: center;">
                    If you believe this is a mistake, please contact your landlord directly.
                </p>
            </div>
            
            <div class="footer">
                <p>RentEase Home Management</p>
                <p>&copy; ${new Date().getFullYear()} RentEase. All rights reserved.</p>
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

module.exports = sendTenantRemovalEmail;
