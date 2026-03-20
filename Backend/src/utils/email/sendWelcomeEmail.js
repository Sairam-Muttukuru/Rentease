const nodemailer = require("nodemailer");
const path = require("path");

const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const faviconPath = path.join(__dirname, "../../../../public/favicon.png");

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ADMIN,
                pass: process.env.EMAIL_ADMIN_PASS
            }
        });

        const cleanName = userName.replace(/undefined/g, "").trim() || "Valued Merchant";

        await transporter.sendMail({
            from: `"RentEase" <${process.env.EMAIL_ADMIN}>`,
            to: userEmail,
            subject: "Welcome to RentEase! 🏠",
            html: `
                <head>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Playfair+Display:ital,wght@1,700&display=swap" rel="stylesheet">
                </head>
                <div style="background-color: #f3f4f6; padding: 50px 0; margin: 0; width: 100%; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                        <!-- Branding Header -->
                        <tr>
                            <td style="padding: 70px 0 40px 0; text-align: center;">
                                <img src="cid:renteasefavicon" alt="RentEase" width="150" height="120" style="border-radius: 20px; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2);">
                                <div style="color: #4f46e5; font-size: 14px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; margin-top: 15px; font-family: 'Inter', sans-serif; opacity: 0.8;">Home Management</div>
                            </td>
                        </tr>

                        <!-- Hero Text -->
                        <tr>
                            <td style="padding: 0 60px 45px 60px; text-align: center;">
                                <h1 style="color: #111827; font-size: 34px; font-weight: 800; line-height: 1.1; margin: 0 0 20px 0; letter-spacing: -0.04em;">
                                    Welcome home,<br>
                                    <span style="font-family: 'Playfair Display', Georgia, serif; font-style: italic; color: #4f46e5; font-weight: 700;">${cleanName}</span>
                                </h1>
                                <p style="color: #4b5563; font-size: 18px; line-height: 1.6; margin: 0; font-family: 'Inter', sans-serif;">
                                    You've just joined the modern way to manage rentals. We're excited to help you streamline your property journey.
                                </p>
                            </td>
                        </tr>

                        <!-- Feature Grid / Guide -->
                        <tr>
                            <td style="padding: 0 60px 50px 60px;">
                                <div style="background-color: #f9fafb; border: 1px solid #f1f5f9; border-radius: 24px; padding: 40px;">
                                    <h3 style="color: #64748b; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 25px 0; font-family: 'Inter', sans-serif;">Your Journey Starts Here</h3>
                                    
                                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td valign="top" style="padding-bottom: 25px;">
                                                <div style="background-color: #4f46e5; color: #ffffff; width: 28px; height: 28px; border-radius: 8px; text-align: center; line-height: 28px; font-weight: 700; font-size: 14px;">1</div>
                                            </td>
                                            <td style="padding-bottom: 25px; padding-left: 18px;">
                                                <div style="color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 4px; font-family: 'Inter', sans-serif;">Complete Your Profile</div>
                                                <div style="color: #64748b; font-size: 14px; line-height: 1.5; font-family: 'Inter', sans-serif;">Verify your identity to get approved for properties faster.</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td valign="top" style="padding-bottom: 25px;">
                                                <div style="background-color: #4f46e5; color: #ffffff; width: 28px; height: 28px; border-radius: 8px; text-align: center; line-height: 28px; font-weight: 700; font-size: 14px;">2</div>
                                            </td>
                                            <td style="padding-bottom: 25px; padding-left: 18px;">
                                                <div style="color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 4px; font-family: 'Inter', sans-serif;">Smart Search</div>
                                                <div style="color: #64748b; font-size: 14px; line-height: 1.5; font-family: 'Inter', sans-serif;">Find your next home or list your property with powerful automated tools.</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td valign="top">
                                                <div style="background-color: #4f46e5; color: #ffffff; width: 28px; height: 28px; border-radius: 8px; text-align: center; line-height: 28px; font-weight: 700; font-size: 14px;">3</div>
                                            </td>
                                            <td style="padding-left: 18px;">
                                                <div style="color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 4px; font-family: 'Inter', sans-serif;">One-Click Payments</div>
                                                <div style="color: #64748b; font-size: 14px; line-height: 1.5; font-family: 'Inter', sans-serif;">Pay rent, deposit, and utilities securely with a single tap.</div>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </td>
                        </tr>

                        <!-- CTA Section -->
                        <tr>
                            <td style="padding: 0 60px 60px 60px; text-align: center;">
                                <a href="http://localhost:5173/login" style="background-color: #111827; color: #ffffff; padding: 22px 50px; border-radius: 14px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; font-family: 'Inter', sans-serif; box-shadow: 0 4px 15px rgba(17, 24, 39, 0.25);">
                                    Access Your Dashboard
                                </a>
                                <p style="margin-top: 30px; color: #94a3b8; font-size: 14px; font-family: 'Inter', sans-serif;">
                                    Questions? <a href="mailto:support@rentease.com" style="color: #4f46e5; text-decoration: none; font-weight: 700;">We're here to help.</a>
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #111827; padding: 60px; text-align: center;">
                                <img src="cid:renteasefavicon" alt="RentEase" height="32" style="margin-bottom: 30px; opacity: 0.9;">
                                <div style="color: #6b7280; font-size: 13px; line-height: 1.6; font-family: 'Inter', sans-serif;">
                                    &copy; ${new Date().getFullYear()} RentEase Home Management.<br>
                                    Redefining the rental experience for the modern world.<br>
                                    <div style="margin-top: 20px;">
                                        <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px; font-weight: 600;">Twitter</a> • 
                                        <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px; font-weight: 600;">LinkedIn</a> • 
                                        <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 10px; font-weight: 600;">Instagram</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            `,
            attachments: [
                {
                    filename: 'favicon.png',
                    path: faviconPath,
                    cid: 'renteasefavicon'
                }
            ]
        });

        console.log(`Premium welcome email sent to ${userEmail}`);
    } catch (error) {
        console.error("Error sending welcome email:", error);
    }
};

module.exports = sendWelcomeEmail;
