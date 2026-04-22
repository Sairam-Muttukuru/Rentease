const sendMail = require("./sendMail");
const EmailWrapper = require("./EmailWrapper");

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
    console.log("Preparing to send invitation email to:", tenantEmail);

    const getDaySuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    let dueDay = rentDueDate;
    if (typeof rentDueDate === 'string' && rentDueDate.includes('-')) {
        dueDay = parseInt(rentDueDate.split('-')[2], 10);
    }
    const formattedRentDate = `${dueDay}${getDaySuffix(dueDay)} of every month`;

    const contentHtml = `
        <h1 class="title-text">
            Welcome to <span style="color: #6366f1;">${propertyName}</span>! 👋
        </h1>
        <p class="body-text">
            Hello <b>${tenantName}</b>,<br><br>
            Your landlord, <b>${landlordName}</b>, has officially invited you to join their property on RentEase. Here's a quick overview of your lease terms:
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; padding: 32px; margin-bottom: 32px;">
            <h2 style="font-size: 11px; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 24px 0;">Residency Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 12px 0; color: #64748b; font-size: 14px;">Address</td>
                    <td style="padding: 12px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${propertyAddress}</td>
                </tr>
                <tr style="border-top: 1px solid #f1f5f9;">
                    <td style="padding: 12px 0; color: #64748b; font-size: 14px;">Monthly Rent</td>
                    <td style="padding: 12px 0; color: #10b981; font-size: 18px; font-weight: 900; text-align: right;">₹${Number(monthlyRent).toLocaleString()}</td>
                </tr>
                <tr style="border-top: 1px solid #f1f5f9;">
                    <td style="padding: 12px 0; color: #64748b; font-size: 14px;">Move-in Date</td>
                    <td style="padding: 12px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${new Date(startDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                </tr>
                <tr style="border-top: 1px solid #f1f5f9;">
                    <td style="padding: 12px 0; color: #64748b; font-size: 14px;">Rent Due</td>
                    <td style="padding: 12px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${formattedRentDate}</td>
                </tr>
            </table>
        </div>
    `;

    const html = EmailWrapper({
        title: `Welcome to ${propertyName}`,
        heroImage: propertyImageUrl,
        contentHtml: contentHtml,
        ctaText: "Go to Dashboard",
        ctaUrl: `${process.env.FRONTEND_URL}/login`,
        footerNote: "The modern way to manage your residency."
    });

    try {
        await sendMail(tenantEmail, `Welcome Home! You've been invited to ${propertyName} 🏠`, html);
        console.log(`✅ Professional Invitation Email sent to: ${tenantEmail}`);
    } catch (error) {
        console.error("❌ Error sending invitation email:", error);
    }
};

module.exports = sendTenantInvitationEmail;
