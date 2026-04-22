const sendMail = require("./sendMail");

const sendAnnouncementEmail = async ({
    tenantEmail,
    tenantName,
    landlordName,
    propertyName,
    roomNumber,
    propertyImage,
    announcementTitle,
    announcementContent,
    announcementCategory,
    announcementPriority
}) => {
    console.log("Preparing to send announcement email to:", tenantEmail);

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return '#f43f5e'; // Rose 500
            case 'medium': return '#f59e0b'; // Amber 500
            default: return '#10b981'; // Emerald 500
        }
    };

    const priorityColor = getPriorityColor(announcementPriority);

    const subject = `New Notice: ${propertyName}`;
    
    // Default placeholder if no image exists
    const displayImage = propertyImage || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000";

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Notice: ${propertyName}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Outfit', sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            
            <!-- Logo Header -->
            <div style="padding: 24px; text-align: left; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px;">
                <img src="cid:renteasefavicon" alt="RentEase" style="height: 32px; width: 32px; border-radius: 8px; object-fit: contain; background-color: #ffffff; padding: 2px;" />
                <span style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">RentEase</span>
            </div>

            <!-- Hero Section -->
            <div style="position: relative; height: 260px;">
                <img src="${displayImage}" alt="Property" style="width: 100%; height: 100%; object-fit: cover;" />
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);"></div>
                <div style="position: absolute; bottom: 24px; left: 24px; right: 24px;">
                    <span style="background: ${priorityColor}; color: white; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Official Notice</span>
                    <h1 style="color: white; margin: 12px 0 0 0; font-size: 28px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.4);">${propertyName} ${roomNumber ? `#${roomNumber}` : ''}</h1>
                </div>
            </div>

            <!-- Content Body -->
            <div style="padding: 40px 32px;">
                <p style="font-size: 16px; color: #475569; line-height: 1.7; margin: 0 0 32px 0;">
                    Hello <b>${tenantName}</b>,<br><br>
                    A new important notice has been posted by your landlord, <b>${landlordName}</b>. Please review the details below.
                </p>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 6px solid ${priorityColor}; border-radius: 16px; padding: 30px; margin-bottom: 32px;">
                    <div style="margin-bottom: 16px;">
                        <span style="background: #f1f5f9; color: #475569; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase;">${announcementCategory}</span>
                        <span style="background: ${priorityColor}20; color: ${priorityColor}; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-left: 8px;">${announcementPriority?.toUpperCase()} PRIORITY</span>
                    </div>
                    <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0;">${announcementTitle}</h2>
                    <p style="font-size: 16px; line-height: 1.7; color: #334155; white-space: pre-wrap; margin: 0;">${announcementContent}</p>
                </div>

                <div style="text-align: center; margin-top: 48px;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 18px 36px; border-radius: 14px; font-weight: 700; text-decoration: none; font-size: 16px; box-shadow: 0 10px 15px rgba(79, 70, 229, 0.4);">
                        View via Dashboard
                    </a>
                </div>
            </div>

            <!-- Footer -->
            <div style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                <div style="font-weight: 800; color: #6366f1; font-size: 20px; margin-bottom: 8px;">RentEase</div>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">This is an automated notification from your property management platform.</p>
                <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">&copy; ${new Date().getFullYear()} RentEase. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `

    try {
        await sendMail(tenantEmail, subject, html);
        console.log(`✅ Announcement Email sent to: ${tenantEmail}`);
    } catch (error) {
        console.error("❌ Error sending announcement email:", error);
    }
};

module.exports = sendAnnouncementEmail;
