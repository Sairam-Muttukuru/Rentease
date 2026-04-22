const sendMail = require("./sendMail");

module.exports = async (email, slot) => {
  try {
    const { visit_date, start_time, end_time, propertyName, propertyImage, name, worker_details } = slot;
    const subject = `Visit Scheduled: Slot Confirmed for ${propertyName || 'Your Property'}`;
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

    const workersHtml = worker_details && Array.isArray(worker_details) && worker_details.length > 0 
      ? `
      <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
          <h2 style="font-size: 11px; color: #0369a1; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 16px 0;">Technical Team Assigned</h2>
          <table style="width: 100%; border-collapse: collapse;">
              ${worker_details.map(worker => `
                <tr>
                    <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 700;">${worker.name}</td>
                    <td style="padding: 8px 0; color: #0369a1; font-size: 14px; font-weight: 600; text-align: right;">${worker.phone}</td>
                </tr>
              `).join('')}
          </table>
      </div>
      `
      : '';

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Visit Scheduled</title>
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
                                    <img src="cid:renteasefavicon" alt="Logo" width="32" height="32" style="display: block; width: 32px; height: 32px; border-radius: 8px; object-fit: contain; background-color: #ffffff; padding: 2px;" />
                                </td>
                                <td style="vertical-align: middle;">
                                    <span style="font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; font-family: 'Outfit', sans-serif;">RentEase</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- Hero Image Section -->
            <div style="height: 240px; background-color: #f1f5f9; overflow: hidden; position: relative;">
                <img src="${propertyImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600'}" alt="Property" width="600" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);"></div>
                <div style="position: absolute; bottom: 24px; left: 24px; right: 24px;">
                    <span style="background: #4f46e5; color: white; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; display: inline-block;">
                        Service Scheduled
                    </span>
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Hi ${name || 'Valued Customer'}! 👋</h1>
                    <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">${propertyName}</p>
                </div>
            </div>

            <!-- Content Body -->
            <div style="padding: 40px 32px;">
                <p style="font-size: 16px; color: #475569; line-height: 1.7; margin: 0 0 32px 0;">
                    Hello,<br><br>
                    A professional visit has been scheduled for your service request. Please review the confirmed time slot and the assigned personnel below.
                </p>

                ${workersHtml}
                
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                    <h2 style="font-size: 11px; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 20px 0;">Slot Specifications</h2>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Visit Date</td>
                            <td style="padding: 10px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${formattedDate}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Arrival window starts</td>
                            <td style="padding: 10px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${formatTime(start_time)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Arrival window ends</td>
                            <td style="padding: 10px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${formatTime(end_time)}</td>
                        </tr>
                        <tr style="border-top: 1px solid #e2e8f0;">
                            <td style="padding: 14px 0 10px 0; color: #64748b; font-size: 14px;">Status</td>
                            <td style="padding: 14px 0 10px 0; color: #10b981; font-size: 14px; font-weight: 800; text-align: right; text-transform: uppercase;">Confirmed</td>
                        </tr>
                    </table>
                </div>

                <div style="background-color: #e0f2fe; border-radius: 12px; padding: 16px 20px; display: inline-block;">
                    <p style="margin: 0; font-size: 14px; color: #0369a1; line-height: 1.5;">
                        <b>Prompt Response:</b> If you need to reschedule, please notify your professional via the RentEase dashboard as soon as possible.
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                <div style="font-weight: 800; color: #6366f1; font-size: 20px; margin-bottom: 8px;">RentEase</div>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">Everything easier, with RentEase.</p>
                <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">&copy; ${new Date().getFullYear()} RentEase. All rights reserved.</p>
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
