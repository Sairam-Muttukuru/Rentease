const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

const sendReceiptEmail = (tenantEmail, payment) => {
    return new Promise((resolve, reject) => {
        const faviconPath = path.join(__dirname, "../../../../public/favicon.png");
        
        // 1️⃣ Create PDF in memory
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", async () => {
            const pdfData = Buffer.concat(buffers);

            try {
                // 2️⃣ Mail setup
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL_ADMIN,
                        pass: process.env.EMAIL_ADMIN_PASS
                    }
                });

                // 3️⃣ Send email with attachment and inline logo
                await transporter.sendMail({
                    from: `"RentEase" <${process.env.EMAIL_ADMIN}>`,
                    to: tenantEmail,
                    subject: `🧾 Payment Confirmation: ₹${payment.amount.toLocaleString()} for ${payment.property_title}`,
                    html: `
                        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                            <!-- White Minimal Header -->
                            <div style="padding: 30px 20px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #f3f4f6;">
                                <img src="cid:renteasefavicon" alt="RentEase" style="height: 45px; display: block; margin: 0 auto 15px;">
                                <div style="display: inline-block; padding: 6px 12px; background-color: #ecfdf5; color: #059669; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">
                                    Payment Confirmed
                                </div>
                                <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.02em;">Payment Successful!</h1>
                            </div>

                            ${payment.property_image ? `
                            <div style="padding: 0;">
                                <img src="${payment.property_image}" alt="Property" style="width: 100%; max-height: 260px; object-fit: cover; display: block;">
                            </div>
                            ` : ''}

                            <div style="padding: 35px; background: #ffffff;">
                                <h2 style="color: #1e293b; margin-top: 0; font-size: 20px;">Hi ${payment.tenant_name},</h2>
                                <p style="color: #475569; line-height: 1.6; font-size: 15px;">
                                    We've successfully received your payment for <b>${payment.property_title}</b>. 
                                    Your official rent receipt has been generated and is attached to this email.
                                </p>
                                
                                <div style="background: #f9fafb; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #f1f5f9;">
                                    <h3 style="margin-top: 0; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 18px;">Payment Summary</h3>
                                    <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
                                        <tr>
                                            <td style="padding: 10px 0; color: #64748b; font-size: 14px; vertical-align: top; width: 35%;">Amount Paid</td>
                                            <td style="padding: 10px 0; text-align: right; font-weight: 800; color: #111827; font-size: 18px; vertical-align: top;">₹${payment.amount.toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 10px 0; color: #64748b; font-size: 14px; vertical-align: top; width: 35%;">Transaction ID</td>
                                            <td style="padding: 10px 0; text-align: right; font-size: 13px; color: #1e293b; font-family: 'Roboto Mono', monospace; word-break: break-all; vertical-align: top;">${payment.transaction_id}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 10px 0; color: #64748b; font-size: 14px; vertical-align: top; width: 35%;">Receipt No.</td>
                                            <td style="padding: 10px 0; text-align: right; font-size: 13px; color: #1e293b; word-break: break-all; vertical-align: top;">${payment.receipt_number}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 10px 0; color: #64748b; font-size: 14px; vertical-align: top; width: 35%;">Payment Date</td>
                                            <td style="padding: 10px 0; text-align: right; font-size: 14px; color: #1e293b; vertical-align: top;">${new Date(payment.payment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                        </tr>
                                    </table>
                                </div>

                                <div style="text-align: center; margin-top: 30px;">
                                    <a href="http://localhost:5173/login" style="background: #4f46e5; color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; display: inline-block; transition: all 0.3s ease;">Go to Tenant Dashboard</a>
                                </div>
                                
                                <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-top: 25px;">
                                    Questions? Reply to this email or visit our help center.
                                </p>
                            </div>

                            <div style="background: #f1f5f9; padding: 25px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
                                <p style="margin-bottom: 8px; font-weight: 600; color: #475569;"> RentEase Home Management </p>
                                <p style="margin: 0;">Fast. Easy. Reliable.</p>
                                <p style="margin: 10px 0 0;">&copy; ${new Date().getFullYear()} RentEase Inc. All rights reserved.</p>
                            </div>
                        </div>
                    `,
                    attachments: [
                        {
                            filename: `${payment.receipt_number}.pdf`,
                            content: pdfData
                        },
                        {
                            filename: 'favicon.png',
                            path: faviconPath,
                            cid: 'renteasefavicon'
                        }
                    ]
                });
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });

        // 4️⃣ Professional PDF Design
        try {
            // Header Section
            if (fs.existsSync(faviconPath)) {
                doc.image(faviconPath, 50, 45, { width: 60 });
            }
            
            doc.fillColor("#111827")
               .fontSize(22)
               .font("Helvetica-Bold")
               .text("RENTAL RECEIPT", 200, 50, { align: "right" });
            
            doc.fillColor("#64748b")
               .fontSize(10)
               .font("Helvetica")
               .text(`Receipt No: ${payment.receipt_number}`, 200, 80, { align: "right" });
            
            doc.moveDown(2);
            doc.moveTo(50, 110).lineTo(550, 110).strokeColor("#e2e8f0").stroke();
            
            // Content Sections
            doc.moveDown(2);
            
            // Details Grid
            const startY = 140;
            const col1 = 50;
            const col2 = 300;
            
            // Left Column: Property & Tenant
            doc.fillColor("#64748b").fontSize(10).text("PROPERTY", col1, startY);
            doc.fillColor("#1e293b").fontSize(12).font("Helvetica-Bold").text(payment.property_title, col1, startY + 15);
            
            doc.moveDown();
            doc.fillColor("#64748b").fontSize(10).font("Helvetica").text("TENANT", col1, doc.y + 10);
            doc.fillColor("#1e293b").fontSize(12).font("Helvetica-Bold").text(payment.tenant_name, col1, doc.y + 5);
            
            // Right Column: Payment Info
            doc.fillColor("#64748b").fontSize(10).font("Helvetica").text("PAYMENT DATE", col2, startY);
            doc.fillColor("#1e293b").fontSize(12).font("Helvetica-Bold").text(new Date(payment.payment_date).toDateString(), col2, startY + 15);
            
            doc.moveDown();
            doc.fillColor("#64748b").fontSize(10).font("Helvetica").text("TRANSACTION ID", col2, doc.y + 10);
            doc.fillColor("#1e293b").fontSize(11).font("Helvetica-Bold").text(payment.transaction_id, col2, doc.y + 5);
            
            // Payment Summary Table
            doc.moveDown(3);
            const tableY = doc.y;
            doc.rect(50, tableY, 500, 30).fill("#f8fafc");
            doc.fillColor("#64748b").fontSize(10).font("Helvetica-Bold").text("DESCRIPTION", 60, tableY + 10);
            doc.text("AMOUNT", 450, tableY + 10, { width: 90, align: "right" });
            
            doc.fillColor("#1e293b").font("Helvetica").text(`Rent payment for property: ${payment.property_title}`, 60, tableY + 45);
            doc.font("Helvetica-Bold").text(`₹${payment.amount.toLocaleString()}`, 450, tableY + 45, { width: 90, align: "right" });
            
            doc.moveTo(50, tableY + 70).lineTo(550, tableY + 70).strokeColor("#f1f5f9").stroke();
            
            // Total Section (Clean, Professional Bordered Box)
            doc.moveDown(2);
            doc.rect(340, doc.y, 210, 50).lineWidth(1).strokeColor("#e2e8f0").stroke();
            const boxY = doc.y;
            doc.fillColor("#64748b").fontSize(10).font("Helvetica-Bold").text("TOTAL PAID", 355, boxY + 12);
            doc.fillColor("#111827").fontSize(18).text(`₹${payment.amount.toLocaleString()}`, 355, boxY + 28, { width: 185, align: "right" });
            
            // Paid Stamp (Clean, Bottom Right)
            doc.rotate(-10, { origin: [480, 580] });
            doc.rect(430, 560, 90, 35).lineWidth(2).strokeColor("#059669");
            doc.fillColor("#059669").fontSize(16).font("Helvetica-Bold").text("PAID", 455, 571);
            doc.rotate(10, { origin: [480, 580] });

            // Footer
            doc.fillColor("#94a3b8").fontSize(9).font("Helvetica").text("This is a computer-generated receipt and does not require a physical signature.", 50, 700, { align: "center", width: 500 });
            doc.text("© " + new Date().getFullYear() + " RentEase Home Management. Fast. Easy. Reliable.", 50, 715, { align: "center", width: 500 });

            doc.end();
        } catch (pdfErr) {
            console.error("PDF generation error:", pdfErr);
            doc.end();
        }
    });
};

module.exports = sendReceiptEmail;
