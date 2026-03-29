const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

module.exports = (res, payment) => {
  const doc = new PDFDocument({ margin: 0, size: 'A4' });
  // Stream PDF to response
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Receipt_${payment.receipt_number || 'download'}.pdf`
  );
  doc.pipe(res);

  // Robust multi-environment image locating strategy
  const fallbackPaths = [
    path.resolve(__dirname, "../../../../Frontend/public/favicon.png"),       // Local side-by-side
    path.resolve(__dirname, "../../../../../../Frontend/public/favicon.png"), // Extra nested
    path.resolve(process.cwd(), "public/favicon.png"),                        // Vercel / Root structure
    path.resolve(process.cwd(), "../Frontend/public/favicon.png"),            // Run from Backend root
    path.join(__dirname, "../../../../public/favicon.png")                    // V1 classic fallback
  ];
  
  const faviconPath = fallbackPaths.find(p => fs.existsSync(p));

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
  // A larger, clean crisp stamp that fits "PAID IN FULL" perfectly
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
};

