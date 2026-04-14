const sendMail = require("./sendMail");
const PDFDocument = require("pdfkit");
const fs = require("fs");

/**
 * Professional Receipt Email Dispatcher
 * @param {string} tenantEmail 
 * @param {object} payment 
 */
const sendReceiptEmail = (tenantEmail, payment) => {
    return new Promise((resolve, reject) => {
        // 1️⃣ Create PDF in memory
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", async () => {
            const pdfData = Buffer.concat(buffers);

            try {
                const subject = `🧾 Payment Confirmation: ₹${payment.amount.toLocaleString()} for ${payment.property_title}`;
                const propertyImage = payment.property_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600';
                
                const html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Digital Payment Receipt</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                        
                        <!-- Logo Header (Table-based for Bulletproof Rendering) -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                            <tr>
                                <td style="padding: 24px;">
                                    <table cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td style="vertical-align: middle; padding-right: 12px;">
                                                <img src="${process.env.FRONTEND_URL || 'https://rentease-home.vercel.app'}/favicon.png" alt="Logo" width="32" height="32" style="display: block; width: 32px; height: 32px; border-radius: 8px;" />
                                            </td>
                                            <td style="vertical-align: middle;">
                                                <span style="font-size: 22px; font-weight: 800; color: #010101; letter-spacing: -0.5px; font-family: 'Segoe UI', Arial, sans-serif;">RentEase</span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>

                        <!-- Property Hero Section -->
                        <div style="height: 240px; background-color: #f1f5f9; overflow: hidden; position: relative;">
                            <img src="${propertyImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600'}" alt="Property" width="600" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);"></div>
                            <div style="position: absolute; bottom: 24px; left: 24px;">
                                <span style="background: #10b981; color: white; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; display: inline-block;">Payment Confirmed</span>
                                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">Hi ${tenantName}! 👋</h1>
                            </div>
                        </div>

                        <!-- Content Body -->
                        <div style="padding: 40px 32px;">
                            <h1 style="color: #0f172a; margin: 0 0 16px 0; font-size: 26px; font-weight: 800;">Payment Confirmed</h1>
                            <p style="font-size: 16px; color: #64748b; line-height: 1.7; margin: 0 0 32px 0;">
                                Hello <b>${payment.tenant_name || 'Resident'}</b>,<br><br>
                                We've successfully processed your payment for <b>${payment.property_title || 'your property'}</b>. 
                                Attached you will find your official digital receipt (PDF) for your personal records.
                            </p>
                            
                            <!-- Financial Breakdown Concept -->
                            <div style="background-color: #f1f5f9; border-radius: 20px; padding: 32px; margin-bottom: 32px;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding-bottom: 12px; color: #64748b; font-size: 14px;">Transaction Date</td>
                                        <td style="padding-bottom: 12px; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${new Date(payment.payment_date || new Date()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding-bottom: 12px; color: #64748b; font-size: 14px;">Receipt #</td>
                                        <td style="padding-bottom: 12px; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${payment.receipt_number || 'N/A'}</td>
                                    </tr>
                                    <tr style="border-top: 1px solid #cbd5e1;">
                                        <td style="padding: 20px 0 0 0; color: #0f172a; font-size: 16px; font-weight: 700;">Total Amount</td>
                                        <td style="padding: 20px 0 0 0; color: #10b981; font-size: 24px; font-weight: 800; text-align: right;">₹${payment.amount.toLocaleString()}</td>
                                    </tr>
                                </table>
                            </div>

                            <div style="background-color: #fffbeb; border: 1px dashed #fcd34d; border-radius: 12px; padding: 16px; text-align: center;">
                                <p style="margin: 0; font-size: 13px; color: #92400e; font-weight: 600;">
                                    📎 Please download the attached PDF for a full line-item breakdown.
                                </p>
                            </div>
                        </div>
                        
                        <!-- Footer -->
                        <div style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                            <div style="font-weight: 800; color: #6366f1; font-size: 20px; margin-bottom: 8px;">RentEase</div>
                            <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Smart Property Management Solutions</p>
                            <p style="font-size: 12px; color: #94a3b8; margin-top: 24px;">&copy; ${new Date().getFullYear()} RentEase Home Management. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                `;

                await sendMail(tenantEmail, subject, html, [
                    {
                        filename: `${payment.receipt_number || 'receipt'}.pdf`,
                        content: pdfData
                    }
                ]);
                resolve(true);
            } catch (err) {
                console.error("❌ sendReceiptEmail error:", err.message);
                reject(err);
            }
        });

        // 2️⃣ Professional PDF Design
        try {
            const faviconPath = sendMail.GlobalFaviconPath;
            doc.rect(0, 0, doc.page.width, 140).fill("#1e1b4b");

            if (faviconPath) {
                doc.image(faviconPath, 65, 45, { width: 55 });
            } else {
                doc.fillColor("#ffffff").fontSize(32).font("Helvetica-Bold").text("RE", 60, 50);
            }

            doc.fillColor("#ffffff").fontSize(28).font("Helvetica-Bold").text("RentEase", 135, 55);
            doc.fillColor("#ffffff").fontSize(22).font("Helvetica-Bold").text("OFFICIAL RECEIPT", 0, 45, { align: "right", paddingRight: 50, width: doc.page.width - 50 });
            doc.fillColor("#94a3b8").fontSize(10).font("Helvetica").text(`Receipt #: ${payment.receipt_number || 'N/A'}`, 0, 75, { align: "right", paddingRight: 50, width: doc.page.width - 50 });
            doc.text(`Date Issued: ${new Date().toLocaleDateString('en-IN')}`, 0, 90, { align: "right", paddingRight: 50, width: doc.page.width - 50 });

            const startY = 180;
            const col1 = 50;
            const col2 = 320;

            doc.fillColor("#64748b").fontSize(10).font("Helvetica-Bold").text("BILLED TO", col1, startY);
            doc.fillColor("#0f172a").fontSize(14).text(payment.tenant_name || "Resident", col1, startY + 15);
            doc.fillColor("#475569").fontSize(10).font("Helvetica").text(`Tenant ID: ${payment.tenant_id || "N/A"}`, col1, startY + 35);

            doc.fillColor("#64748b").fontSize(10).font("Helvetica-Bold").text("PAYMENT DETAILS", col2, startY);
            doc.fillColor("#0f172a").fontSize(12).font("Helvetica-Bold").text(`Date: ${new Date(payment.payment_date || new Date()).toLocaleDateString('en-IN')}`, col2, startY + 15);
            doc.fillColor("#475569").fontSize(10).font("Helvetica").text(`TXN ID: ${payment.transaction_id || "N/A"}`, col2, startY + 35);

            const tableY = startY + 110;
            doc.rect(50, tableY, doc.page.width - 100, 35).fill("#f1f5f9");
            doc.fillColor("#475569").fontSize(11).font("Helvetica-Bold").text("DESCRIPTION", 70, tableY + 12);
            doc.text("AMOUNT", doc.page.width - 150, tableY + 12, { width: 80, align: "right" });

            doc.fillColor("#0f172a").fontSize(12).font("Helvetica").text(payment.property_title ? `Rent Payment - ${payment.property_title}` : "Monthly Rent Payment", 70, tableY + 55);
            doc.font("Helvetica-Bold").text(`INR ${Number(payment.amount).toLocaleString()}`, doc.page.width - 180, tableY + 55, { width: 110, align: "right" });

            const boxY = tableY + 130;
            doc.rect(doc.page.width - 280, boxY, 230, 60).fill("#f8fafc");
            doc.rect(doc.page.width - 280, boxY, 230, 60).strokeColor("#cbd5e1").stroke();
            doc.fillColor("#64748b").fontSize(12).font("Helvetica-Bold").text("TOTAL PAID", doc.page.width - 265, boxY + 23);
            doc.fillColor("#4f46e5").fontSize(20).text(`INR ${Number(payment.amount).toLocaleString()}`, doc.page.width - 265, boxY + 20, { width: 200, align: "right" });

            doc.rotate(-12, { origin: [doc.page.width - 150, boxY + 120] });
            doc.rect(doc.page.width - 200, boxY + 100, 160, 45).lineWidth(4).strokeColor("#10b981").stroke();
            doc.fillColor("#10b981").fontSize(22).font("Helvetica-Bold").text("PAID IN FULL", doc.page.width - 200, boxY + 112, { width: 160, align: "center" });
            doc.rotate(12, { origin: [doc.page.width - 150, boxY + 120] });

            doc.end();
        } catch (pdfErr) {
            console.error("❌ PDF Gen Error:", pdfErr);
            doc.end();
        }
    });
};

module.exports = sendReceiptEmail;
