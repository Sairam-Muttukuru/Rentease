const sendMail = require("./sendMail");
const EmailWrapper = require("./EmailWrapper");

const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const cleanName = (userName || "").replace(/undefined/g, "").trim() || "Valued Merchant";

        const contentHtml = `
            <h1 class="title-text">
                Welcome home,<br>
                <span style="color: #6366f1;">${cleanName}</span>
            </h1>
            <p class="body-text">
                You've just joined the modern way to manage properties. At RentEase, we help you streamline everything from maintenance to payments, all in one premium interface.
            </p>

            <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 20px; padding: 32px;">
                <h3 style="color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 20px 0;">Quick Start Guide</h3>
                
                <div style="margin-bottom: 20px;">
                    <div style="color: #0f172a; font-weight: 700; font-size: 15px; margin-bottom: 4px;">1. Update Your Profile</div>
                    <div style="color: #64748b; font-size: 13px; line-height: 1.5;">Ensure your details are accurate for smooth communication within the ecosystem.</div>
                </div>

                <div>
                    <div style="color: #0f172a; font-weight: 700; font-size: 15px; margin-bottom: 4px;">2. Explore Dashboard</div>
                    <div style="color: #64748b; font-size: 13px; line-height: 1.5;">Check out your property listings, payments, and live updates from your hub.</div>
                </div>
            </div>
        `;

        const html = EmailWrapper({
            title: "Welcome to RentEase!",
            heroImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200", // Bright modern luxury home
            contentHtml: contentHtml,
            ctaText: "Go to Dashboard",
            footerNote: "The future of property management is here."
        });

        await sendMail(userEmail, "Welcome home to RentEase! 🏠", html);
        console.log(`✅ Professional Welcome email dispatched to ${userEmail}`);
    } catch (error) {
        console.error("❌ Welcome dispatcher failure:", error);
    }
};

module.exports = sendWelcomeEmail;
