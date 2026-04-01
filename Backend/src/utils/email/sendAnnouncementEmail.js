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
        <style>
            body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; }
            .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding-bottom: 60px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; margin-top: 40px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
            
            .hero { position: relative; height: 260px; background-image: url('${displayImage}'); background-size: cover; background-position: center; }
            .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%); }
            .hero-content { position: absolute; bottom: 30px; left: 30px; right: 30px; color: white; }
            .property-label { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #818cf8; margin-bottom: 8px; }
            .property-name { font-size: 24px; font-weight: 800; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }

            .main-content { padding: 40px 35px; }
            .greeting { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
            .intro-text { font-size: 16px; line-height: 1.6; color: #64748b; margin-bottom: 32px; }
            
            .announcement-box { background-color: #fdfdfd; border: 1px solid #e2e8f0; border-radius: 20px; padding: 30px; position: relative; border-left: 6px solid ${priorityColor}; }
            .category-badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase; background: #f1f5f9; color: #475569; margin-bottom: 16px; }
            .priority-badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase; background: ${priorityColor}20; color: ${priorityColor}; margin-left: 8px; }
            
            .announcement-title { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
            .announcement-text { font-size: 16px; line-height: 1.7; color: #334155; white-space: pre-wrap; margin: 0; }
            
            .action-area { text-align: center; margin-top: 48px; }
            .cta-button { display: inline-block; padding: 18px 36px; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; border-radius: 14px; font-weight: 700; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.4); }
            
            .footer { text-align: center; padding: 40px 20px; color: #94a3b8; font-size: 14px; }
            .footer-logo { font-weight: 800; color: #6366f1; font-size: 20px; margin-bottom: 12px; }
            .social-links { margin: 20px 0; }
            .divider { height: 1px; background: #e2e8f0; margin: 32px 0; }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="container">
                <div class="hero">
                    <div class="hero-overlay"></div>
                    <div class="hero-content">
                        <div class="property-label">Official Announcement</div>
                        <h1 class="property-name">${propertyName} ${roomNumber ? `#${roomNumber}` : ''}</h1>
                    </div>
                </div>

                <div class="main-content">
                    <p class="greeting">Hello ${tenantName},</p>
                    <p class="intro-text">
                        A new important notice has been posted by your landlord, <strong>${landlordName}</strong>. Please review the details below to stay informed.
                    </p>

                    <div class="announcement-box">
                        <div class="category-badge">${announcementCategory}</div>
                        <div class="priority-badge">${announcementPriority?.toUpperCase()} PRIORITY</div>
                        <h2 class="announcement-title">${announcementTitle}</h2>
                        <p class="announcement-text">${announcementContent}</p>
                    </div>

                    <div class="action-area">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/tenant-dashboard" class="cta-button">View Full Details</a>
                    </div>

                    <div class="divider"></div>

                    <div class="footer">
                        <div class="footer-logo">RentEase</div>
                        <p>This is an automated notification from your property management platform.</p>
                        <p style="margin-top: 20px;">&copy; ${new Date().getFullYear()} RentEase Home Management. All rights reserved.</p>
                    </div>
                </div>
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
