const sendMail = require("./sendMail");

const sendComplaintMail = async ({ landlordEmail, landlordName, tenantName, propertyName, propertyImage, complaint }) => {
  const heroImage = propertyImage || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  const subject = `Urgent Action Required: New Issue at ${propertyName || 'Your Property'}`;
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Issue Reported</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width: 620px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
        
        <!-- Logo Header -->
        <div style="padding: 24px; text-align: left; background: #ffffff; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px;">
            <img src="${process.env.FRONTEND_URL || 'https://rentease-home.vercel.app'}/favicon.png" alt="RentEase" style="height: 32px; width: 32px; border-radius: 8px;" />
            <span style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">RentEase</span>
        </div>

        <!-- Hero Section -->
        <div style="position: relative; height: 220px;">
            <img src="${heroImage}" alt="Property" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%);"></div>
            <div style="position: absolute; bottom: 20px; left: 24px;">
                <span style="background: #ef4444; color: white; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Urgent Action Required</span>
                <h1 style="color: white; margin: 12px 0 0 0; font-size: 24px; font-weight: 800;">Issue at ${propertyName || 'Property'}</h1>
            </div>
        </div>

        <!-- Content Body -->
        <div style="padding: 40px 32px;">
            <p style="font-size: 16px; color: #475569; line-height: 1.7; margin: 0 0 32px 0;">
                Hi <b>${landlordName}</b>,<br><br>
                A new issue has been reported by tenant <b>${tenantName}</b>. Please review the details below to ensure a timely resolution.
            </p>

            <!-- Info Cards -->
            <div style="margin-bottom: 32px; display: grid; gap: 16px;">
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
                    <div style="font-size: 11px; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Reported Issue</div>
                    <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">${complaint.title}</div>
                    
                    <div style="margin-top: 16px;">
                        <span style="background: #f1f5f9; color: #475569; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase;">${complaint.category}</span>
                        <span style="background: ${complaint.priority_level === 'High' ? '#fee2e2' : '#f1f5f9'}; color: ${complaint.priority_level === 'High' ? '#ef4444' : '#475569'}; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-left: 8px;">${complaint.priority_level?.toUpperCase()} PRIORITY</span>
                    </div>
                </div>

                <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
                    <div style="font-size: 11px; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Description</div>
                    <p style="font-size: 15px; line-height: 1.7; color: #334155; margin: 0;">${complaint.description}</p>
                </div>
            </div>

            <div style="text-align: center; margin-top: 40px;">
                <a href="${process.env.FRONTEND_URL}/landlord-dashboard" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 18px 40px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                    Open Manager Dashboard
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
            <div style="font-weight: 800; color: #6366f1; font-size: 20px; margin-bottom: 8px;">RentEase</div>
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">© ${new Date().getFullYear()} RentEase Home Management. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;

  try {
    console.log(`📧 Attempting to send complaint email to: ${landlordEmail}`);
    await sendMail(landlordEmail, subject, html);
    console.log("✅ Complaint Email sent successfully");
  } catch (error) {
    console.error("❌ Error sending complaint email:", error);
    throw error;
  }
};

module.exports = sendComplaintMail;
