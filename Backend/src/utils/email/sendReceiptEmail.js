const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

const sendReceiptEmail = (tenantEmail, payment) => {
    return new Promise((resolve, reject) => {
        const fallbackPaths = [
            path.resolve(__dirname, "../../../../Frontend/public/favicon.png"),       
            path.resolve(__dirname, "../../../../../../Frontend/public/favicon.png"), 
            path.resolve(process.cwd(), "public/favicon.png"),                        
            path.resolve(process.cwd(), "../Frontend/public/favicon.png"),            
            path.join(__dirname, "../../../../public/favicon.png")                    
        ];
        const faviconPath = fallbackPaths.find(p => fs.existsSync(p));
        
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
            // --- Beautiful Header Bar ---
            doc.rect(0, 0, doc.page.width, 140).fill("#1e1b4b"); // Deep indigo/slate

            if (faviconPath) {
                // Just render the logo directly without the white circle so it blends seamlessly
                doc.image(faviconPath, 65, 45, { width: 55 });
            } else {
                doc.fillColor("#ffffff")
                .fontSize(32)
                .font("Helvetica-Bold")
                .text("RE", 60, 50);
            }

            // Company Name
            doc.fillColor("#ffffff")
                .fontSize(28)
                .font("Helvetica-Bold")
                .text("RentEase", 135, 55);

            // Receipt Titles
            doc.fillColor("#ffffff")
                .fontSize(22)
                .font("Helvetica-Bold")
                .text("OFFICIAL RECEIPT", 0, 45, { align: "right", paddingRight: 50, width: doc.page.width - 50 });
            
            doc.fillColor("#94a3b8")
                .fontSize(10)
                .font("Helvetica")
                .text(`Receipt #: ${payment.receipt_number || 'N/A'}`, 0, 75, { align: "right", paddingRight: 50, width: doc.page.width - 50 });
            doc.text(`Date Issued: ${new Date().toLocaleDateString('en-IN')}`, 0, 90, { align: "right", paddingRight: 50, width: doc.page.width - 50 });

            // --- Content Section ---
            const startY = 180;
            const col1 = 50;
            const col2 = 320;

            // Invoice To
            doc.fillColor("#64748b").fontSize(10).font("Helvetica-Bold").text("BILLED TO", col1, startY);
            doc.fillColor("#0f172a").fontSize(14).text(payment.paid_by || payment.tenant_name || "Resident", col1, startY + 15);
            doc.fillColor("#475569").fontSize(10).font("Helvetica").text(`Tenant ID: ${payment.tenant_id || "N/A"}`, col1, startY + 35);

            // Payment Details
            doc.fillColor("#64748b").fontSize(10).font("Helvetica-Bold").text("PAYMENT DETAILS", col2, startY);
            doc.fillColor("#0f172a").fontSize(12).font("Helvetica-Bold").text(`Date: ${new Date(payment.payment_date || new Date()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, col2, startY + 15);
            doc.fillColor("#475569").fontSize(10).font("Helvetica").text(`TXN ID: ${payment.transaction_id || payment.payment_id || "N/A"}`, col2, startY + 35);
            
            let methodDisplay = payment.method || "Online Payment";
            if (payment.ui_type === 'RAZORPAY_STYLE' && payment.payment_method_ui) {
                methodDisplay = `${payment.payment_method_ui.toUpperCase()} (Razorpay)`;
            }
            doc.text(`Method: ${methodDisplay}`, col2, startY + 50);

            // --- Beautiful Table Section ---
            const tableY = startY + 110;
            
            // Table Header
            doc.rect(50, tableY, doc.page.width - 100, 35).fill("#f1f5f9");
            doc.fillColor("#475569").fontSize(11).font("Helvetica-Bold").text("DESCRIPTION", 70, tableY + 12);
            doc.text("AMOUNT", doc.page.width - 150, tableY + 12, { width: 80, align: "right" });

            // Table Row
            doc.fillColor("#0f172a").fontSize(12).font("Helvetica").text(payment.property_title ? `Rent Payment - ${payment.property_title}` : "Monthly Rent Payment", 70, tableY + 55);
            doc.font("Helvetica-Bold").text(`INR ${Number(payment.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}`, doc.page.width - 180, tableY + 55, { width: 110, align: "right" });

            // Divider
            doc.moveTo(50, tableY + 90).lineTo(doc.page.width - 50, tableY + 90).strokeColor("#e2e8f0").stroke();

            // --- Total Box ---
            const boxY = tableY + 130;
            doc.rect(doc.page.width - 280, boxY, 230, 60).fill("#f8fafc");
            doc.rect(doc.page.width - 280, boxY, 230, 60).lineWidth(1).strokeColor("#cbd5e1").stroke();
            
            doc.fillColor("#64748b").fontSize(12).font("Helvetica-Bold").text("TOTAL PAID", doc.page.width - 265, boxY + 23);
            doc.fillColor("#4f46e5").fontSize(20).text(`INR ${Number(payment.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}`, doc.page.width - 265, boxY + 20, { width: 200, align: "right" });

            // --- PAID Stamp ---
            doc.rotate(-12, { origin: [doc.page.width - 150, boxY + 120] });
            doc.rect(doc.page.width - 200, boxY + 100, 160, 45).lineWidth(4).strokeColor("#10b981").stroke();
            doc.fillColor("#10b981").fontSize(22).font("Helvetica-Bold").text("PAID IN FULL", doc.page.width - 200, boxY + 112, { width: 160, align: "center", characterSpacing: 2 });
            doc.rotate(12, { origin: [doc.page.width - 150, boxY + 120] });

            // --- Footer ---
            const footerY = doc.page.height - 100;
            doc.moveTo(50, footerY - 20).lineTo(doc.page.width - 50, footerY - 20).strokeColor("#e2e8f0").stroke();
            doc.fillColor("#94a3b8").fontSize(10).font("Helvetica").text("This is a computer-generated receipt. No physical signature is required.", 50, footerY, { align: "center", width: doc.page.width - 100 });
            doc.text("RentEase Inc. | support@rentease.com | Fast. Easy. Reliable.", 50, footerY + 20, { align: "center", width: doc.page.width - 100 });
            doc.text(`© ${new Date().getFullYear()} RentEase Home Management. All rights reserved.`, 50, footerY + 40, { align: "center", width: doc.page.width - 100 });

            doc.end();
        } catch (pdfErr) {
            console.error("PDF generation error:", pdfErr);
            doc.end();
        }
    });
};

module.exports = sendReceiptEmail;
