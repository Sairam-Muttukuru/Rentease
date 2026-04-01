const sendMail = require("./sendMail");

module.exports = async (email, slot) => {
  try {
    const { visit_date, start_time, end_time } = slot;
    const subject = `Visit Scheduled: Slot Confirmed`;
    const formattedDate = new Date(visit_date).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formatTime = (t) => {
      if (!t) return "";
      const [h, m] = t.split(':');
      const hours = parseInt(h);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      return `${hours % 12 || 12}:${m} ${ampm}`;
    };

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
            .label { font-weight: 600; color: #4b5563; font-size: 14px; padding: 12px 0; width: 40%; }
            .value { font-weight: 500; color: #111827; font-size: 14px; padding: 12px 0; text-align: right; }
            .footer { background-color: #f9fafb; text-align: center; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
            .status-badge { display: inline-block; background-color: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
               <h1 style="margin: 0; font-size: 24px; color: white;">Visit Scheduled!</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Your service provider has scheduled a visit for your request. Please note the following time slot:</p>
              
              <div style="text-align: center;">
                 <div class="status-badge">Slot Confirmed</div>
              </div>
    
              <table class="details-table">
                <tr class="detail-row">
                  <td class="label">Visit Date</td>
                  <td class="value">${formattedDate}</td>
                </tr>
                <tr class="detail-row">
                  <td class="label">Start Time</td>
                  <td class="value">${formatTime(start_time)}</td>
                </tr>
                <tr class="detail-row">
                  <td class="label">End Time</td>
                  <td class="value">${formatTime(end_time)}</td>
                </tr>
              </table>
    
              <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">Please be available at the location during this period. If you need to reschedule, please contact your service provider via the RentEase chat.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} RentEase. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
    `;

    await sendMail(email, subject, htmlContent);
  } catch (err) {
    console.error(`❌ Failed to send slot mail:`, err.message);
  }
};
