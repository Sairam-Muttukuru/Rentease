const sendMail = require("./sendMail");

module.exports = async (email, tenantName, serviceName, providerName, providerPhone, bookingDate, bookingTime, address, amount, paymentMethod) => {
  try {
    const subject = `✅ Service Request Accepted: ${serviceName}`;
    const formattedDate = new Date(bookingDate).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px; }
            .details-table { width: 100%; border-collapse: collapse; }
            .detail-row { border-bottom: 1px solid #e5e7eb; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: 600; color: #4b5563; font-size: 14px; padding: 8px 0; width: 40%; vertical-align: top; }
            .value { font-weight: 500; color: #111827; font-size: 14px; padding: 8px 0; text-align: right; vertical-align: top; }
            .footer { background-color: #f9fafb; text-align: center; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
            .button { display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; text-align: center; }
            .status-badge { display: inline-block; background-color: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="cid:renteasefavicon" alt="RentEase" style="height: 50px; margin-bottom: 10px;">
              <h1 style="margin: 0; font-size: 24px; color: white;">Service Request Accepted!</h1>
              <div class="status-badge">Confirmed</div>
            </div>
            <div class="content">
              <p>Hello <strong>${tenantName}</strong>,</p>
              
              <p>Great news! Your request for <strong>${serviceName}</strong> has been accepted by <strong>${providerName}</strong>.</p>
              
              <p>Your service provider will arrive at the scheduled time. Here are the confirmed details:</p>
              
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
                  <tr class="detail-row">
                    <td class="label">Date</td>
                    <td class="value">${formattedDate}</td>
                  </tr>
                  <tr class="detail-row">
                    <td class="label">Time</td>
                    <td class="value">${bookingTime}</td>
                  </tr>
                  <tr class="detail-row">
                    <td class="label">Payment</td>
                    <td class="value">₹${amount} (${paymentMethod})</td>
                  </tr>
                  <tr class="detail-row">
                    <td class="label">Provider Contact</td>
                    <td class="value">${providerPhone}</td>
                  </tr>
                </table>
              </div>

              <p style="font-size: 14px; color: #4b5563;"><strong>Location:</strong><br>${address}</p>
              
              <div style="text-align: center; color: white;">
                <a href="http://localhost:5173/tenant-dashboard" class="button">View Booking Status</a>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">Please ensure someone is available at the location during the scheduled time.</p>
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
    console.log(`✅ Service acceptance email sent to ${email} for booking on ${formattedDate}`);
  } catch (err) {
    console.error(`❌ Failed to send service acceptance email to ${email}:`, err.message);
  }
};

