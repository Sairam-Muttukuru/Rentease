const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

module.exports = (res, payment) => {
    try {
        const doc = new PDFDocument({ margin: 0, size: "A4" });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=RentEase_Receipt_${payment.receipt_number || "download"}.pdf`
        );
        doc.pipe(res);

        // ─── Favicon / Logo Resolution ────────────────────────────────────────
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

        // ═══════════════════════════════════════════════════════════════
        // HEADER — deep indigo bar
        // ═══════════════════════════════════════════════════════════════
        doc.rect(0, 0, W, 140).fill("#1e1b4b"); // Header height 130 -> 140

        // Logo
        if (faviconPath) {
            doc.image(faviconPath, 64, 48, { width: 50 }); // X: 48 -> 64, Y: 38 -> 48
        } else {
            doc.fillColor("#ffffff").fontSize(28).font("Helvetica-Bold").text("RE", 64, 55);
        }

        // Brand name
        doc.fillColor("#ffffff").fontSize(26).font("Helvetica-Bold").text("RentEase", 126, 58); // X: 110 -> 126, Y: 48 -> 58
        doc.fillColor("#a5b4fc").fontSize(10).font("Helvetica").text("Smart Property Management", 126, 89);

        // Right side — OFFICIAL RECEIPT + receipt number
        doc.fillColor("#ffffff").fontSize(20).font("Helvetica-Bold")
            .text("OFFICIAL RECEIPT", 0, 52, { align: "right", width: W - 64 });
        doc.fillColor("#a5b4fc").fontSize(10).font("Helvetica")
            .text(`Receipt No: ${payment.receipt_number || "N/A"}`, 0, 80, { align: "right", width: W - 64 });
        doc.fillColor("#a5b4fc")
            .text(`Issued: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`, 0, 96, { align: "right", width: W - 64 });

        // ═══════════════════════════════════════════════════════════════
        // STATUS RIBBON — green paid banner
        // ═══════════════════════════════════════════════════════════════
        doc.rect(0, 140, W, 46).fill("#059669"); // Y: 130 -> 140
        doc.fillColor("#ffffff").fontSize(13).font("Helvetica-Bold")
            .text("✓  PAYMENT CONFIRMED & VERIFIED", 0, 154, { align: "center", width: W }); // Y: 144 -> 154

        // ═══════════════════════════════════════════════════════════════
        // PARTY DETAILS — Billed To  +  Billed By  (two columns)
        // ═══════════════════════════════════════════════════════════════
        const sectionY = 230; // 210 -> 230
        const col1X = 64; // 48 -> 64
        const col2X = W / 2 + 20;
        const colW  = W / 2 - 84; // Adjusted for 64 margin

        // ── Left card background
        doc.rect(col1X, sectionY, colW, 120).fill("#f8fafc")
            .rect(col1X, sectionY, colW, 120).lineWidth(1).strokeColor("#e2e8f0").stroke();

        // ── Right card background
        doc.rect(col2X, sectionY, colW, 120).fill("#f8fafc")
            .rect(col2X, sectionY, colW, 120).lineWidth(1).strokeColor("#e2e8f0").stroke();

        // Left — Tenant (Billed To)
        doc.fillColor("#6366f1").fontSize(9).font("Helvetica-Bold")
            .text("BILLED TO (TENANT)", col1X + 16, sectionY + 14);
        doc.fillColor("#0f172a").fontSize(14).font("Helvetica-Bold")
            .text(payment.tenant_name || payment.paid_by || "Resident", col1X + 16, sectionY + 30, { width: colW - 32 });
        doc.fillColor("#64748b").fontSize(9).font("Helvetica")
            .text(`Tenant ID : ${payment.tenant_id || "N/A"}`, col1X + 16, sectionY + 56)
            .text(`Property  : ${payment.property_title || "N/A"}`, col1X + 16, sectionY + 72, { width: colW - 32 })
            .text(`Address   : ${payment.property_address || "N/A"}`, col1X + 16, sectionY + 88, { width: colW - 32 });

        // Right — Landlord (Received By)
        doc.fillColor("#6366f1").fontSize(9).font("Helvetica-Bold")
            .text("RECEIVED BY (LANDLORD)", col2X + 16, sectionY + 14);
        doc.fillColor("#0f172a").fontSize(14).font("Helvetica-Bold")
            .text(payment.landlord_name || "Property Owner", col2X + 16, sectionY + 30, { width: colW - 32 });
        doc.fillColor("#64748b").fontSize(9).font("Helvetica")
            .text(`Payment Date    : ${new Date(payment.payment_date || new Date()).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`, col2X + 16, sectionY + 56)
            .text(`Transaction ID  : ${payment.transaction_id || "N/A"}`, col2X + 16, sectionY + 72, { width: colW - 32 })
            .text(`Gateway         : ${payment.payment_gateway || "Stripe"}`, col2X + 16, sectionY + 88, { width: colW - 32 });

        // ═══════════════════════════════════════════════════════════════
        // PAYMENT TABLE
        // ═══════════════════════════════════════════════════════════════
        const tableTop = sectionY + 148;
        const tableW   = W - 128; // 96 -> 128 (64*2)

        // Table header row
        doc.rect(col1X, tableTop, tableW, 32).fill("#1e1b4b");
        doc.fillColor("#ffffff").fontSize(10).font("Helvetica-Bold")
            .text("DESCRIPTION", col1X + 16, tableTop + 11)
            .text("DUE DATE", col1X + tableW * 0.50, tableTop + 11, { width: 100 })
            .text("AMOUNT", col1X + tableW * 0.72, tableTop + 11, { width: tableW * 0.28 - 16, align: "right" });

        // Table content row
        doc.rect(col1X, tableTop + 32, tableW, 44).fill("#f1f5f9");
        const isDeposit = (payment.receipt_number || "").startsWith("SEC");
        const description = isDeposit
            ? `Security Deposit — ${payment.property_title || "Property"}`
            : `Monthly Rent — ${payment.property_title || "Property"}`;
        const dueDateStr = payment.due_date
            ? new Date(payment.due_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
            : "N/A";

        doc.fillColor("#0f172a").fontSize(11).font("Helvetica")
            .text(description, col1X + 16, tableTop + 46, { width: tableW * 0.45 });
        doc.text(dueDateStr, col1X + tableW * 0.50, tableTop + 46, { width: 100 });
        doc.font("Helvetica-Bold")
            .text(
                `Rs. ${Number(payment.amount).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`,
                col1X + tableW * 0.72, tableTop + 46,
                { width: tableW * 0.28 - 16, align: "right" }
            );

        // Divider below table row
        // No separator line here as requested


        // ═══════════════════════════════════════════════════════════════
        // TOTAL BOX (right-aligned)
        // ═══════════════════════════════════════════════════════════════
        const totalBoxY = tableTop + 90;
        const totalBoxX = col1X + tableW - 220;

        doc.rect(totalBoxX, totalBoxY, 220, 68).fill("#eff6ff")
            .rect(totalBoxX, totalBoxY, 220, 68).lineWidth(1.5).strokeColor("#6366f1").stroke();

        doc.fillColor("#475569").fontSize(10).font("Helvetica-Bold")
            .text("TOTAL AMOUNT PAID", totalBoxX + 14, totalBoxY + 12);
        doc.fillColor("#1e1b4b").fontSize(22).font("Helvetica-Bold")
            .text(
                `Rs. ${Number(payment.amount).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`,
                totalBoxX + 14, totalBoxY + 30, { width: 192, align: "right" }
            );

        // ═══════════════════════════════════════════════════════════════
        // PAID STAMP — rotated
        // ═══════════════════════════════════════════════════════════════
        const stampX = col1X + 40;
        const stampY = totalBoxY + 2;

        doc.save();
        doc.rotate(-14, { origin: [stampX + 80, stampY + 28] });
        doc.rect(stampX, stampY, 160, 56).lineWidth(4).strokeColor("#16a34a").stroke();
        doc.fillColor("#16a34a").fontSize(24).font("Helvetica-Bold")
            .text("PAID IN FULL", stampX, stampY + 14, { width: 160, align: "center", characterSpacing: 1.5 });
        doc.restore();

        // ═══════════════════════════════════════════════════════════════
        // INFO NOTE
        // ═══════════════════════════════════════════════════════════════
        const noteY = totalBoxY + 90;
        doc.rect(col1X, noteY, tableW, 44).fill("#fefce8")
            .rect(col1X, noteY, tableW, 44).lineWidth(1).strokeColor("#fde68a").stroke();
        doc.fillColor("#92400e").fontSize(9).font("Helvetica")
            .text(
                "Note: This is a digitally generated receipt. No physical signature is required. Please retain this document for your records.",
                col1X + 14, noteY + 14, { width: tableW - 28 }
            );

        // ═══════════════════════════════════════════════════════════════
        // FOOTER
        // ═══════════════════════════════════════════════════════════════
        const footerY = H - 80;
        doc.rect(0, footerY, W, 80).fill("#1e1b4b");

        doc.fillColor("#a5b4fc").fontSize(10).font("Helvetica-Bold")
            .text("RentEase", 0, footerY + 14, { align: "center", width: W });
        doc.fillColor("#7c86b5").fontSize(8.5).font("Helvetica")
            .text("support@rentease.com  |  Smart Property Management — Fast. Easy. Reliable.", 0, footerY + 30, { align: "center", width: W })
            .text(`© ${new Date().getFullYear()} RentEase Home Management. All rights reserved.`, 0, footerY + 48, { align: "center", width: W });

        doc.end();
    } catch (error) {
        console.error("[generateReceipt] CRITICAL ERROR:", error);
        if (!res.headersSent) {
            res.status(500).send("Error generating PDF receipt");
        }
    }
};
