const sendMail = require("./sendMail");
const path = require("path");

const sendServiceCompletionMail = async (email, userName, serviceName, providerName, amount, paymentMethod) => {
    try {
        const subject = `Service Completed: ${serviceName}`;
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f7f6; }
                .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center; }
                .content { padding: 30px; }
                .details-table { width: 100%; border-collapse: collapse; }
                .detail-row { border-bottom: 1px solid #d1fae5; }
                .detail-row:last-child { border-bottom: none; }
                .label { font-weight: 600; color: #065f46; font-size: 14px; padding: 12px 0; width: 40%; vertical-align: top; }
                .value { font-weight: 500; color: #111827; font-size: 14px; padding: 12px 0; text-align: right; vertical-align: top; }
                .success-msg { text-align: center; color: #059669; font-weight: bold; font-size: 18px; margin: 20px 0; }
                .footer { background-color: #f9fafb; text-align: center; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
                .button { display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; text-align: center; }
                .status-badge { display: inline-block; background-color: #d1fae5; color: #065f46; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0; font-size: 24px;">Service Completed!</h1>
                    <div class="status-badge">Completed</div>
                </div>
                <div class="content">
                    <p>Hello <strong>${userName}</strong>,</p>
                    <p class="success-msg">Your service request has been successfully completed!</p>
                    <p>We hope you are satisfied with the work. Here are the final details of your service:</p>
                    
                    <div style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981;">
                        <table class="details-table">
                            <tr class="detail-row">
                                <td class="label">Service</td>
                                <td class="value">${serviceName}</td>
                            </tr>
                            <tr class="detail-row">
                                <td class="label">Provider</td>
                                <td class="value">${providerName}</td>
                            </tr>
                            <tr class="detail-row">
                                <td class="label">Total Amount</td>
                                <td class="value">₹${amount}</td>
                            </tr>
                            <tr class="detail-row">
                                <td class="label">Payment Method</td>
                                <td class="value">${paymentMethod}</td>
                            </tr>
                        </table>
                    </div>

                    <p>If you have any feedback or issues regarding the service, please feel free to reach out to us or the provider directly.</p>
                    
                    <div style="text-align: center;">
                        <a href="http://localhost:5173/tenant/dashboard" class="button">Rate Your Experience</a>
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} RentEase. All rights reserved.</p>
                    <p>Premium Home Services & Property Management</p>
                </div>
            </div>
        </body>
        </html>
        `
        await sendMail(email, subject, html);
        console.log(`✅ Service completion email sent to ${email}`);
    } catch (err) {
        console.error(`❌ Failed to send service completion email to ${email}:`, err.message);
        throw err;
    }
};

module.exports = sendServiceCompletionMail;

