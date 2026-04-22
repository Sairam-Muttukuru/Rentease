const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

/**
 * Generates and streams a professional PDF receipt for a service payment.
 * @param {object} res - Express response object (for streaming) OR null (for buffer)
 * @param {object} payment - Service payment data
 * @returns {Promise<Buffer>} if res is null, returns the PDF buffer
 */
const generateServiceReceipt = (res, payment) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 0, size: "A4" });
            const buffers = [];

            // Pipe to response or collect buffers
            if (res) {
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader(
                    "Content-Disposition",
                    `inline; filename=RentEase_ServiceReceipt_${payment.receipt_number || "download"}.pdf`
                );
                doc.pipe(res);
            } else {
                doc.on("data", (chunk) => buffers.push(chunk));
                doc.on("end", () => resolve(Buffer.concat(buffers)));
                doc.on("error", reject);
            }

            // ─── Favicon / Logo Resolution ─────────────────────────────
            const fallbackPaths = [
                path.resolve(__dirname, "../../../../Frontend/public/favicon.png"),
                path.resolve(__dirname, "../../../../../../Frontend/public/favicon.png"),
                path.resolve(process.cwd(), "public/favicon.png"),
                path.resolve(process.cwd(), "../Frontend/public/favicon.png"),
                path.join(__dirname, "../../../../public/favicon.png"),
            ];
            const faviconPath = fallbackPaths.find((p) => fs.existsSync(p));

            const W = doc.page.width;   // 595.28
            const H = doc.page.height;  // 841.89

            // ═══════════════════════════════════════════════════════════
            // HEADER — emerald green bar
            // ═══════════════════════════════════════════════════════════
            doc.rect(0, 0, W, 140).fill("#065f46"); // Slightly taller header
            if (faviconPath) {
                doc.image(faviconPath, 64, 48, { width: 50 }); // Moved right (48 -> 64) and down (38 -> 48)
            } else {
                doc.fillColor("#ffffff").fontSize(28).font("Helvetica-Bold").text("RE", 64, 55);
            }
            doc.fillColor("#ffffff").fontSize(26).font("Helvetica-Bold").text("RentEase", 126, 58); // Moved right (110 -> 126) and down (48 -> 58)
            doc.fillColor("#a7f3d0").fontSize(10).font("Helvetica").text("Smart Property Management", 126, 89); // Moved down
            doc.fillColor("#ffffff").fontSize(20).font("Helvetica-Bold")
               .text("SERVICE RECEIPT", 0, 52, { align: "right", width: W - 64 }); // Moved down and more margin right
            doc.fillColor("#a7f3d0").fontSize(10).font("Helvetica")
               .text(`Receipt No: ${payment.receipt_number || "N/A"}`, 0, 80, { align: "right", width: W - 64 })
               .text(`Issued: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`, 0, 96, { align: "right", width: W - 64 });

            // ─── Emerald confirmation ribbon ─────────────────────────────
            doc.rect(0, 140, W, 46).fill("#059669"); // Adjusted Y from 130 -> 140
            doc.fillColor("#ffffff").fontSize(13).font("Helvetica-Bold")
               .text("✓  SERVICE PAYMENT CONFIRMED & VERIFIED", 0, 154, { align: "center", width: W }); // Adjusted Y from 144 -> 154

            // ─── Party detail cards ────────────────────────────────────
            const sectionY = 230; // Shifted down (210 -> 230)
            const col1X = 64, col2X = W / 2 + 20, colW = W / 2 - 84; // Shifted right and narrowed colW to maintain right margin

            doc.rect(col1X, sectionY, colW, 120).fill("#f8fafc")
               .rect(col1X, sectionY, colW, 120).lineWidth(1).strokeColor("#e2e8f0").stroke();
            doc.rect(col2X, sectionY, colW, 120).fill("#f8fafc")
               .rect(col2X, sectionY, colW, 120).lineWidth(1).strokeColor("#e2e8f0").stroke();

            // Left — Payer (Landlord/Tenant)
            doc.fillColor("#059669").fontSize(9).font("Helvetica-Bold")
               .text("PAID BY", col1X + 16, sectionY + 14);
            doc.fillColor("#0f172a").fontSize(14).font("Helvetica-Bold")
               .text(payment.payer_name || "Customer", col1X + 16, sectionY + 30, { width: colW - 32 });
            doc.fillColor("#64748b").fontSize(9).font("Helvetica")
               .text(`Service   : ${payment.service_name || "N/A"}`, col1X + 16, sectionY + 56)
               .text(`Location  : ${payment.property_address || "N/A"}`, col1X + 16, sectionY + 72, { width: colW - 32 });

            // Right — Provider (the one receiving money)
            doc.fillColor("#059669").fontSize(9).font("Helvetica-Bold")
               .text("RECEIVED BY (PROVIDER)", col2X + 16, sectionY + 14);
            doc.fillColor("#0f172a").fontSize(14).font("Helvetica-Bold")
               .text(payment.provider_name || "Service Provider", col2X + 16, sectionY + 30, { width: colW - 32 });
            doc.fillColor("#64748b").fontSize(9).font("Helvetica")
               .text(`Payment Date   : ${new Date(payment.payment_date || new Date()).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`, col2X + 16, sectionY + 56)
               .text(`Payment Method : Online`, col2X + 16, sectionY + 72, { width: colW - 32 });

            // ─── Service table ─────────────────────────────────────────
            const tableTop = sectionY + 148, tableW = W - 128; // Increased margin left/right (64*2 = 128)
            doc.rect(col1X, tableTop, tableW, 32).fill("#065f46");
            doc.fillColor("#ffffff").fontSize(10).font("Helvetica-Bold")
               .text("DESCRIPTION", col1X + 16, tableTop + 11)
               .text("DATE", col1X + tableW * 0.50, tableTop + 11, { width: 100 })
               .text("AMOUNT", col1X + tableW * 0.72, tableTop + 11, { width: tableW * 0.28 - 16, align: "right" });

            doc.rect(col1X, tableTop + 32, tableW, 44).fill("#f1f5f9");
            const desc = payment.service_name || "Professional Service";
            const dateStr = new Date(payment.payment_date || new Date()).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric"
            });

            doc.fillColor("#0f172a").fontSize(11).font("Helvetica")
               .text(desc, col1X + 16, tableTop + 46, { width: tableW * 0.45 })
               .text(dateStr, col1X + tableW * 0.50, tableTop + 46, { width: 100 });
            doc.font("Helvetica-Bold")
               .text(`Rs. ${Number(payment.amount).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`,
                   col1X + tableW * 0.72, tableTop + 46, { width: tableW * 0.28 - 16, align: "right" });

            // ─── Total box ────────────────────────────────────────────
            const totalBoxY = tableTop + 90, totalBoxX = col1X + tableW - 220;
            doc.rect(totalBoxX, totalBoxY, 220, 68).fill("#ecfdf5")
               .rect(totalBoxX, totalBoxY, 220, 68).lineWidth(1.5).strokeColor("#059669").stroke();
            doc.fillColor("#475569").fontSize(10).font("Helvetica-Bold")
               .text("TOTAL AMOUNT PAID", totalBoxX + 14, totalBoxY + 12);
            doc.fillColor("#065f46").fontSize(22).font("Helvetica-Bold")
               .text(`Rs. ${Number(payment.amount).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`,
                   totalBoxX + 14, totalBoxY + 30, { width: 192, align: "right" });

            // ─── PAID stamp ───────────────────────────────────────────
            doc.save();
            doc.rotate(-14, { origin: [col1X + 120, totalBoxY + 28] });
            doc.rect(col1X + 40, totalBoxY + 2, 160, 56).lineWidth(4).strokeColor("#16a34a").stroke();
            doc.fillColor("#16a34a").fontSize(24).font("Helvetica-Bold")
               .text("PAID IN FULL", col1X + 40, totalBoxY + 16, { width: 160, align: "center", characterSpacing: 1.5 });
            doc.restore();

            // ─── Footer ───────────────────────────────────────────────
            doc.rect(0, H - 80, W, 80).fill("#065f46");
            doc.fillColor("#a7f3d0").fontSize(10).font("Helvetica-Bold")
               .text("RentEase", 0, H - 68, { align: "center", width: W });
            doc.fillColor("#6ee7b7").fontSize(8.5).font("Helvetica")
               .text("support@rentease.com  |  Fast. Easy. Reliable.", 0, H - 52, { align: "center", width: W })
               .text(`© ${new Date().getFullYear()} RentEase Home Management. All rights reserved.`, 0, H - 36, { align: "center", width: W });

            doc.end();

            if (res) resolve(null);
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = generateServiceReceipt;
