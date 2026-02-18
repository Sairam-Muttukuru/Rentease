const nodemailer = require("nodemailer");

const sendTenantInvitationEmail = async ({
    tenantEmail,
    tenantName,
    landlordName,
    propertyName,
    propertyAddress,
    monthlyRent,
    startDate,
    rentDueDate,
    propertyImageUrl
}) => {
    console.log("Preparing to send email to:", tenantEmail);
    console.log("Property URL for Email:", propertyImageUrl);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const getDaySuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    // Safely extract day from YYYY-MM-DD string to avoid timezone shifts
    let dueDay = rentDueDate;
    if (typeof rentDueDate === 'string' && rentDueDate.includes('-')) {
        dueDay = parseInt(rentDueDate.split('-')[2], 10);
    }

    const formattedRentDate = `${dueDay}${getDaySuffix(dueDay)} of every month`;

    const imageSection = propertyImageUrl
        ? `<div style="width: 100%; height: 200px; background-image: url('${propertyImageUrl}'); background-size: cover; background-position: center; border-radius: 12px 12px 0 0;"></div>`
        : `<div style="width: 100%; height: 100px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 12px 12px 0 0; display: flex; align-items: center; justify-content: center;"><span style="color:white; font-size: 24px;">🏠</span></div>`;

    const mailOptions = {
        from: `"RentEase Official" <${process.env.EMAIL_USER}>`,
        to: tenantEmail,
        subject: `Welcome Home! You've been invited to ${propertyName} 🏠`,
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to RentEase</title>
            <style>
                body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; color: #1f2937; }
                .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden; }
                .hero { position: relative; }
                .content { padding: 40px 30px; }
                .greeting { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px; }
                .message { font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; }
                
                .property-card { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 32px; }
                .card-header { font-size: 18px; font-weight: 600; color: #374151; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb; }
                
                /* Table Layout for Better Alignment */
                .details-table { width: 100%; border-collapse: collapse; }
                .details-table td { padding: 10px 0; vertical-align: top; }
                .label-cell { color: #6b7280; font-weight: 500; width: 40%; padding-right: 15px; }
                .value-cell { color: #111827; font-weight: 600; text-align: right; width: 60%; }
                
                .cta-button { display: block; width: 100%; text-align: center; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white !important; text-decoration: none; padding: 16px 0; border-radius: 8px; font-weight: 600; font-size: 16px; margin-top: 10px; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2); }
                .cta-button:hover { opacity: 0.9; transform: translateY(-1px); }
                
                .footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 13px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
                .heart { color: #ef4444; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="hero">
                    ${imageSection}
                </div>
                <div class="content">
                    <h1 class="greeting">Welcome Home, ${tenantName}! 👋</h1>
                    
                    <p class="message">
                        We are absolutely delighted to welcome you! Your landlord, <strong>${landlordName}</strong>, has invited you to join <strong>${propertyName}</strong> on RentEase.
                        <br><br>
                        Moving into a new place is the start of a new chapter, and we're here to make sure it's a happy one. Manage your rent, requests, and documents all in one place.
                    </p>
                    
                    <div class="property-card">
                        <div class="card-header">Your New Home Details</div>
                        
                        <table class="details-table">
                            <tr>
                                <td class="label-cell">Property</td>
                                <td class="value-cell">${propertyName}</td>
                            </tr>
                            <tr>
                                <td class="label-cell">Address</td>
                                <td class="value-cell">${propertyAddress}</td>
                            </tr>
                            <tr>
                                <td class="label-cell">Monthly Rent</td>
                                <td class="value-cell">₹${monthlyRent}</td>
                            </tr>
                            <tr>
                                <td class="label-cell">Lease Begins</td>
                                <td class="value-cell">${new Date(startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                            </tr>
                            <tr>
                                <td class="label-cell">Rent Due</td>
                                <td class="value-cell">${formattedRentDate}</td>
                            </tr>
                        </table>
                    </div>

                    <a href="${process.env.FRONTEND_URL}/login" class="cta-button">Accept Invitation & Login</a>
                </div>
                
                <div class="footer">
                    <p>Made with <span class="heart">♥</span> by RentEase Team</p>
                    <p>&copy; ${new Date().getFullYear()} RentEase. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Invitation Email sent to: ${tenantEmail}`);
    } catch (error) {
        console.error("❌ Error sending invitation email:", error);
    }
};

module.exports = sendTenantInvitationEmail;

