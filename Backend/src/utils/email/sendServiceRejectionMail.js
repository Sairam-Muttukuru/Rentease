const sendMail = require("./sendMail");

module.exports = async (email, tenantName, serviceName, providerName, rejectionReason) => {
  try {
    const subject = `❌ Service Request Rejected: ${serviceName}`;

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px; }
            .details-table { width: 100%; border-collapse: collapse; }
            .detail-row { border-bottom: 1px solid #fee2e2; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: 600; color: #991b1b; font-size: 14px; padding: 8px 0; width: 40%; vertical-align: top; }
            .value { font-weight: 500; color: #111827; font-size: 14px; padding: 8px 0; text-align: right; vertical-align: top; }
            .reason-box { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-top: 20px; font-style: italic; color: #4b5563; }
            .footer { background-color: #f9fafb; text-align: center; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
            .button { display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; text-align: center; }
            .status-badge { display: inline-block; background-color: #fee2e2; color: #991b1b; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="cid:renteasefavicon" alt="RentEase" style="height: 50px; margin-bottom: 10px;">
              <h1 style="margin: 0; font-size: 24px; color: white;">Service Request Rejected</h1>
              <div class="status-badge">Rejected</div>
            </div>
            <div class="content">
              <p>Hello <strong>${tenantName}</strong>,</p>
              
              <p>We're sorry to inform you that your request for <strong>${serviceName}</strong> has been rejected by the service provider, <strong>${providerName}</strong>.</p>
              
              <div class="details-box">
                <table class="details-table">
                  <tr class="detail-row">
                    <td class="label">Service</td>
                    <td class="value">${serviceName}</td>
                  </tr>
                  <tr class="detail-row">
                    <td class="label">Provider</td>
                    <td class="value">${providerName}</td>
                  </tr>
                </table>
              </div>

              <p><strong>Reason for rejection:</strong></p>
              <div class="reason-box">
                "${rejectionReason || "No specific reason provided."}"
              </div>
              
              <p style="margin-top: 25px;">You can browse other service providers on the platform to fulfill your request.</p>
              
              <div style="text-align: center;">
                <a href="http://localhost:5173/tenant-dashboard" class="button">Go to Dashboard</a>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} RentEase. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
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

