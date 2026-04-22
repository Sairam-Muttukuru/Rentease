const sendMail = require("./sendMail");
const EmailWrapper = require("./EmailWrapper");

const sendTenantRemovalEmail = async ({
    tenantEmail,
    tenantName,
    landlordName,
    propertyName,
    propertyAddress
}) => {
    console.log("Preparing to send removal email to:", tenantEmail);

    const contentHtml = `
        <h1 class="title-text">
            Hello ${tenantName}, 👋
        </h1>
        <p class="body-text">
            This is to inform you that your residency record for <b>${propertyName}</b> has been officially updated and removed by your landlord, <b>${landlordName}</b>. Access to your property dashboard for this tenancy has been restricted.
        </p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; padding: 32px; margin-bottom: 32px;">
            <h2 style="font-size: 11px; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 20px 0;">Removal Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 12px 0; color: #64748b; font-size: 14px;">Property</td>
                    <td style="padding: 12px 0; color: #010101; font-size: 14px; font-weight: 700; text-align: right;">${propertyName}</td>
                </tr>
                <tr style="border-top: 1px solid #f1f5f9;">
                    <td style="padding: 12px 0; color: #64748b; font-size: 14px;">Effective Date</td>
                    <td style="padding: 12px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                </tr>
            </table>
        </div>

        <div style="background-color: #fff7ed; border-left: 4px solid #f97316; padding: 20px; border-radius: 12px;">
            <p style="margin: 0; font-size: 14px; color: #9a3412; line-height: 1.6;">
                <b>Note:</b> If you believe this removal was made in error, please contact your landlord directly to resolve any discrepancies.
            </p>
        </div>
    `;

    const html = EmailWrapper({
        title: "Residency Update",
        heroImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200", // Standard classy home
        contentHtml: contentHtml,
        ctaText: "Contact Support",
        footerNote: "Safe and secure transitions with RentEase."
    });

    try {
        await sendMail(tenantEmail, `Update regarding your residency at ${propertyName} 🏠`, html);
        console.log(`✅ Professional Removal Email sent to: ${tenantEmail}`);
    } catch (error) {
        console.error("❌ Error sending removal email:", error);
    }
};

module.exports = sendTenantRemovalEmail;
