const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

module.exports = (res, payment) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  const faviconPath = path.join(__dirname, "../../../../public/favicon.png");

  // Stream PDF to response
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Receipt_${payment.receipt_number || 'download'}.pdf`
  );

  doc.pipe(res);

  // --- Header Section ---
  if (fs.existsSync(faviconPath)) {
    doc.image(faviconPath, 50, 45, { width: 60 });
  } else {
    doc.fillColor("#4f46e5")
       .fontSize(24)
       .font("Helvetica-Bold")
       .text("RentEase", 50, 45);
  }

  doc.fillColor("#4f46e5")
     .fontSize(24)
     .font("Helvetica-Bold")
     .text("RENTAL RECEIPT", 200, 50, { align: "right" });

  doc.fillColor("#64748b")
     .fontSize(10)
     .font("Helvetica")
     .text(`Receipt No: ${payment.receipt_number || 'N/A'}`, 200, 80, { align: "right" });

  doc.moveDown(2);
  doc.moveTo(50, 110).lineTo(550, 110).strokeColor("#e2e8f0").stroke();

  // --- Content Section ---
  doc.moveDown(2);
  const startY = 140;
  const col1 = 50;
  const col2 = 300;

  // Left Column
  doc.fillColor("#64748b").fontSize(10).font("Helvetica").text("RECEIVED FROM", col1, startY);
  doc.fillColor("#1e293b").fontSize(12).font("Helvetica-Bold").text(payment.paid_by || "Resident", col1, startY + 15);
  
  doc.moveDown();
  doc.fillColor("#64748b").fontSize(10).font("Helvetica").text("TENANT ID", col1, doc.y + 10);
  doc.fillColor("#1e293b").fontSize(12).font("Helvetica-Bold").text(String(payment.tenant_id || "N/A"), col1, doc.y + 5);

  // Right Column
  doc.fillColor("#64748b").fontSize(10).font("Helvetica").text("PAYMENT DATE", col2, startY);
  doc.fillColor("#1e293b").fontSize(12).font("Helvetica-Bold").text(new Date(payment.payment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), col2, startY + 15);
  
  doc.moveDown();
  doc.fillColor("#64748b").fontSize(10).font("Helvetica").text("TRANSACTION ID", col2, doc.y + 10);
  doc.fillColor("#1e293b").fontSize(11).font("Helvetica-Bold").text(payment.transaction_id || payment.payment_id || "N/A", col2, doc.y + 5);

  // --- Table Section ---
  doc.moveDown(4);
  const tableY = doc.y;
  doc.rect(50, tableY, 500, 30).fill("#f8fafc");
  doc.fillColor("#64748b").fontSize(10).font("Helvetica-Bold").text("DESCRIPTION", 60, tableY + 10);
  doc.text("AMOUNT", 450, tableY + 10, { width: 90, align: "right" });

  doc.fillColor("#1e293b").fontSize(11).font("Helvetica").text("Monthly Rent Payment", 60, tableY + 45);
  
  let methodDisplay = payment.method || "Stripe";
  if (payment.ui_type === 'RAZORPAY_STYLE' && payment.payment_method_ui) {
    methodDisplay = `${payment.payment_method_ui.toUpperCase()} (Razorpay)`;
  }
  doc.fillColor("#64748b").fontSize(9).text(`Method: ${methodDisplay}`, 60, tableY + 60);

  doc.fillColor("#1e293b").fontSize(12).font("Helvetica-Bold").text(`₹${Number(payment.amount).toLocaleString()}`, 450, tableY + 45, { width: 90, align: "right" });

  doc.moveTo(50, tableY + 80).lineTo(550, tableY + 80).strokeColor("#f1f5f9").stroke();

  // --- Total Section ---
  doc.moveDown(3);
  const boxY = doc.y;
  doc.rect(340, boxY, 210, 50).fill("#f8fafc");
  doc.rect(340, boxY, 210, 50).lineWidth(1).strokeColor("#e2e8f0").stroke();
  doc.fillColor("#64748b").fontSize(10).font("Helvetica-Bold").text("TOTAL PAID", 355, boxY + 12);
  doc.fillColor("#1e293b").fontSize(18).text(`₹${Number(payment.amount).toLocaleString()}`, 355, boxY + 28, { width: 185, align: "right" });

  // --- PAID Stamp ---
  doc.rotate(-10, { origin: [480, 600] });
  doc.rect(430, 580, 90, 35).lineWidth(2).strokeColor("#10b981");
  doc.fillColor("#10b981").fontSize(16).font("Helvetica-Bold").text("PAID", 455, 591);
  doc.rotate(10, { origin: [480, 600] });

  // --- Footer ---
  const footerY = 750;
  doc.fillColor("#94a3b8").fontSize(9).font("Helvetica").text("This is a computer-generated receipt and does not require a physical signature.", 50, footerY - 15, { align: "center", width: 500 });
  doc.text("RentEase Inc. | support@rentease.com | Fast. Easy. Reliable.", 50, footerY, { align: "center", width: 500 });
  doc.text(`© ${new Date().getFullYear()} RentEase Home Management. All rights reserved.`, 50, footerY + 15, { align: "center", width: 500 });

  doc.end();
};

