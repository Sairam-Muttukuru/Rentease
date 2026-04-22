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
                    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet">
                    <title>Digital Payment Receipt</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Outfit', sans-serif;">
                    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                        
                        <!-- Logo Header (Table-based for Bulletproof Rendering) -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                            <tr>
                                <td style="padding: 24px;">
                                    <table cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td style="vertical-align: middle; padding-right: 12px;">
                                                <img src="cid:renteasefavicon" alt="RentEase" width="32" height="32" style="display: block; width: 32px; height: 32px; border-radius: 8px; object-fit: contain; background-color: #ffffff; padding: 2px;" />
                                            </td>
                                            <td style="vertical-align: middle;">
                                                <span style="font-size: 22px; font-weight: 800; color: #010101; letter-spacing: -0.5px; font-family: 'Outfit', sans-serif;">RentEase</span>
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
            const W = doc.page.width;
            const H = doc.page.height;

            // Header bar
            doc.rect(0, 0, W, 130).fill("#1e1b4b");
            if (faviconPath) {
                doc.image(faviconPath, 48, 38, { width: 50 });
            } else {
                doc.fillColor("#ffffff").fontSize(28).font("Helvetica-Bold").text("RE", 48, 45);
            }
            doc.fillColor("#ffffff").fontSize(26).font("Helvetica-Bold").text("RentEase", 110, 48);
            doc.fillColor("#a5b4fc").fontSize(10).font("Helvetica").text("Smart Property Management", 110, 79);
            doc.fillColor("#ffffff").fontSize(20).font("Helvetica-Bold")
               .text("OFFICIAL RECEIPT", 0, 42, { align: "right", width: W - 48 });
            doc.fillColor("#a5b4fc").fontSize(10).font("Helvetica")
               .text(`Receipt No: ${payment.receipt_number || 'N/A'}`, 0, 70, { align: "right", width: W - 48 })
               .text(`Issued: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, 0, 86, { align: "right", width: W - 48 });

            // Green confirmation ribbon
            doc.rect(0, 130, W, 46).fill("#059669");
            doc.fillColor("#ffffff").fontSize(13).font("Helvetica-Bold")
               .text("✓  PAYMENT CONFIRMED & VERIFIED", 0, 144, { align: "center", width: W });

            // Party detail cards
            const sectionY = 210;
            const col1X = 48, col2X = W / 2 + 20, colW = W / 2 - 70;

            doc.rect(col1X, sectionY, colW, 120).fill("#f8fafc")
               .rect(col1X, sectionY, colW, 120).lineWidth(1).strokeColor("#e2e8f0").stroke();
            doc.rect(col2X, sectionY, colW, 120).fill("#f8fafc")
               .rect(col2X, sectionY, colW, 120).lineWidth(1).strokeColor("#e2e8f0").stroke();

            // Left — Tenant
            doc.fillColor("#6366f1").fontSize(9).font("Helvetica-Bold")
               .text("BILLED TO (TENANT)", col1X + 16, sectionY + 14);
            doc.fillColor("#0f172a").fontSize(14).font("Helvetica-Bold")
               .text(payment.tenant_name || 'Resident', col1X + 16, sectionY + 30, { width: colW - 32 });
            doc.fillColor("#64748b").fontSize(9).font("Helvetica")
               .text(`Tenant ID : ${payment.tenant_id || 'N/A'}`, col1X + 16, sectionY + 56)
               .text(`Property  : ${payment.property_title || 'N/A'}`, col1X + 16, sectionY + 72, { width: colW - 32 });

            // Right — Landlord
            doc.fillColor("#6366f1").fontSize(9).font("Helvetica-Bold")
               .text("RECEIVED BY (LANDLORD)", col2X + 16, sectionY + 14);
            doc.fillColor("#0f172a").fontSize(14).font("Helvetica-Bold")
               .text(payment.landlord_name || 'Property Owner', col2X + 16, sectionY + 30, { width: colW - 32 });
            doc.fillColor("#64748b").fontSize(9).font("Helvetica")
               .text(`Payment Date   : ${new Date(payment.payment_date || new Date()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, col2X + 16, sectionY + 56)
               .text(`Transaction ID : ${payment.transaction_id || 'N/A'}`, col2X + 16, sectionY + 72, { width: colW - 32 })
               .text(`Gateway        : ${payment.payment_gateway || 'Stripe'}`, col2X + 16, sectionY + 88, { width: colW - 32 });

            // Payment table
            const tableTop = sectionY + 148, tableW = W - 96;
            doc.rect(col1X, tableTop, tableW, 32).fill("#1e1b4b");
            doc.fillColor("#ffffff").fontSize(10).font("Helvetica-Bold")
               .text("DESCRIPTION", col1X + 16, tableTop + 11)
               .text("DUE DATE", col1X + tableW * 0.50, tableTop + 11, { width: 100 })
               .text("AMOUNT (INR)", col1X + tableW * 0.72, tableTop + 11, { width: tableW * 0.28 - 16, align: "right" });

            doc.rect(col1X, tableTop + 32, tableW, 44).fill("#f1f5f9");
            const isDeposit = (payment.receipt_number || '').startsWith('SEC');
            const desc = isDeposit
                ? `Security Deposit — ${payment.property_title || 'Property'}`
                : `Monthly Rent — ${payment.property_title || 'Property'}`;
            const dueDateStr = payment.due_date
                ? new Date(payment.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                : 'N/A';

            doc.fillColor("#0f172a").fontSize(11).font("Helvetica")
               .text(desc, col1X + 16, tableTop + 46, { width: tableW * 0.45 })
               .text(dueDateStr, col1X + tableW * 0.50, tableTop + 46, { width: 100 });
            doc.font("Helvetica-Bold")
               .text(`₹ ${Number(payment.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
                   col1X + tableW * 0.72, tableTop + 46, { width: tableW * 0.28 - 16, align: "right" });
            doc.moveTo(col1X, tableTop + 76).lineTo(col1X + tableW, tableTop + 76)
               .lineWidth(1).strokeColor("#e2e8f0").stroke();

            // Total box
            const totalBoxY = tableTop + 90, totalBoxX = col1X + tableW - 220;
            doc.rect(totalBoxX, totalBoxY, 220, 68).fill("#eff6ff")
               .rect(totalBoxX, totalBoxY, 220, 68).lineWidth(1.5).strokeColor("#6366f1").stroke();
            doc.fillColor("#475569").fontSize(10).font("Helvetica-Bold")
               .text("TOTAL AMOUNT PAID", totalBoxX + 14, totalBoxY + 12);
            doc.fillColor("#1e1b4b").fontSize(22).font("Helvetica-Bold")
               .text(`₹ ${Number(payment.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
                   totalBoxX + 14, totalBoxY + 30, { width: 192, align: "right" });

            // PAID stamp
            doc.save();
            doc.rotate(-14, { origin: [col1X + 120, totalBoxY + 28] });
            doc.rect(col1X + 40, totalBoxY + 2, 160, 56).lineWidth(4).strokeColor("#16a34a").stroke();
            doc.fillColor("#16a34a").fontSize(24).font("Helvetica-Bold")
               .text("PAID IN FULL", col1X + 40, totalBoxY + 16, { width: 160, align: "center", characterSpacing: 1.5 });
            doc.restore();

            // Footer
            doc.rect(0, H - 80, W, 80).fill("#1e1b4b");
            doc.fillColor("#a5b4fc").fontSize(10).font("Helvetica-Bold")
               .text("RentEase", 0, H - 68, { align: "center", width: W });
            doc.fillColor("#7c86b5").fontSize(8.5).font("Helvetica")
               .text("support@rentease.com  |  Fast. Easy. Reliable.", 0, H - 52, { align: "center", width: W })
               .text(`© ${new Date().getFullYear()} RentEase Home Management. All rights reserved.`, 0, H - 36, { align: "center", width: W });

            doc.end();
        } catch (pdfErr) {
            console.error("❌ PDF Gen Error:", pdfErr);
            doc.end();
        }
    });
};

module.exports = sendReceiptEmail;
