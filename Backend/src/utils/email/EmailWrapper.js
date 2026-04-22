const fs = require('fs');
const path = require('path');

/**
 * RentEase Standardized Email Branding Wrapper
 * Ensures consistent typography (Inter/Segoe UI), color palette, and professional hierarchy.
 */
const EmailWrapper = ({
    title = "RentEase Update",
    heroImage = null,
    contentHtml = "",
    ctaText = "Go to Dashboard",
    ctaUrl = process.env.FRONTEND_URL || "https://rentease-home.vercel.app",
    footerNote = "Everything easier, with RentEase."
}) => {
    const currentYear = new Date().getFullYear();
    const faviconUrl = "cid:renteasefavicon";
    const finalHeroImage = heroImage || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200";

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
            
            body {
                margin: 0;
                padding: 0;
                background-color: #f8fafc;
                font-family: 'Outfit', sans-serif;
            }

            .container {
                max-width: 620px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 32px;
                overflow: hidden;
                box-shadow: 0 30px 60px rgba(15, 23, 42, 0.1);
                border: 1px solid #e2e8f0;
            }

            .brand-header {
                padding: 32px 40px;
                text-align: center;
                background: #ffffff;
            }

            .logo-img {
                width: 44px;
                height: 44px;
                border-radius: 12px;
                object-fit: contain;
                background-color: #ffffff;
                padding: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                margin-bottom: 12px;
            }

            .brand-name {
                font-size: 26px;
                font-weight: 900;
                color: #0f172a;
                letter-spacing: -0.5px;
                margin: 0;
            }

            .brand-tagline {
                color: #6366f1;
                font-size: 11px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.25em;
                margin-top: 4px;
            }

            .hero-section {
                height: 260px;
                overflow: hidden;
                position: relative;
            }

            .hero-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }

            .content-area {
                padding: 48px 48px 60px 48px;
            }

            .title-text {
                font-size: 34px;
                font-weight: 900;
                line-height: 1.15;
                color: #0f172a;
                margin: 0 0 24px 0;
                letter-spacing: -0.025em;
            }

            .body-text {
                font-size: 16px;
                line-height: 1.75;
                color: #475569;
                margin: 0 0 32px 0;
            }

            .cta-btn {
                display: inline-block;
                background-color: #0f172a;
                color: #ffffff !important;
                padding: 20px 48px;
                border-radius: 18px;
                font-weight: 700;
                text-decoration: none;
                font-size: 16px;
                box-shadow: 0 10px 25px rgba(15, 23, 42, 0.2);
            }

            .footer {
                padding: 48px 40px;
                background-color: #f8fafc;
                border-top: 1px solid #f1f5f9;
                text-align: center;
            }

            .footer-copy {
                font-size: 12px;
                color: #94a3b8;
                margin-top: 16px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Professional Branding Header -->
            <div class="brand-header">
                <img src="${faviconUrl}" class="logo-img" alt="Logo" />
                <h1 class="brand-name">RentEase</h1>
                <div class="brand-tagline">Smart Home Management</div>
            </div>

            <!-- Mandatory Property Image Section -->
            <div class="hero-section">
                <img src="${finalHeroImage}" class="hero-img" alt="Property" />
                <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 80px; background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);"></div>
            </div>

            <div class="content-area">
                ${contentHtml}

                <div style="text-align: center; margin-top: 40px;">
                    <a href="${ctaUrl}" class="cta-btn">${ctaText}</a>
                </div>
            </div>

            <div class="footer">
                <div style="font-weight: 900; color: #6366f1; font-size: 18px;">RentEase</div>
                <div style="font-size: 13px; font-weight: 600; color: #64748b; margin-top: 8px;">${footerNote}</div>
                <p class="footer-copy">&copy; ${currentYear} RentEase Ecosystem. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = EmailWrapper;
