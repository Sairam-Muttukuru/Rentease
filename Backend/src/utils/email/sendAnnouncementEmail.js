const sendMail = require("./sendMail");

const sendAnnouncementEmail = async ({
    tenantEmail,
    tenantName,
    landlordName,
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

    const subject = `📢 New Announcement: ${announcementTitle}`;
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Announcement</title>
        <style>
            body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; color: #1f2937; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center; color: white; }
            .content { padding: 40px 30px; }
            .greeting { font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 16px; }
            .message { font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; }
            .announcement-card { background-color: #f9fafb; border: 1px solid #e5e7eb; border-left: 5px solid ${priorityColor}; border-radius: 8px; padding: 24px; margin-bottom: 32px; }
            .card-title { font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 8px; }
            .card-meta { display: flex; gap: 10px; font-size: 14px; color: #6b7280; margin-bottom: 16px; }
            .badge { padding: 2px 8px; border-radius: 4px; background-color: #e5e7eb; font-weight: 500; }
            .card-body { font-size: 16px; line-height: 1.6; color: #374151; white-space: pre-wrap; }
            .footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 13px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
            .btn { display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="cid:renteasefavicon" alt="RentEase" style="height: 50px; margin-bottom: 10px;">
                <h1 style="color: white; margin: 0;">New Property Announcement</h1>
            </div>
            <div class="content">
                <p class="greeting">Hello ${tenantName},</p>
                <p class="message">
                    Your landlord, <strong>${landlordName}</strong>, has posted a new announcement regarding your property. Please read the details below.
                </p>
                <div class="announcement-card">
                    <div class="card-title">${announcementTitle}</div>
                    <div class="card-meta">
                        <span class="badge">${announcementCategory}</span>
                        <span class="badge" style="background-color: ${priorityColor}20; color: ${priorityColor}; border: 1px solid ${priorityColor}40;">${announcementPriority?.toUpperCase()} Priority</span>
                    </div>
                    <div class="card-body">${announcementContent}</div>
                </div>
                <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/tenant-dashboard" class="btn">View in Dashboard</a>
                </div>
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
        console.log(`✅ Announcement Email sent to: ${tenantEmail}`);
    } catch (error) {
        console.error("❌ Error sending announcement email:", error);
    }
};

module.exports = sendAnnouncementEmail;
