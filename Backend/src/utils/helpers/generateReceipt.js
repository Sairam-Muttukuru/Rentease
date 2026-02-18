const PDFDocument = require("pdfkit");
const path = require("path");

module.exports = (res, payment) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  // Stream PDF to response
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Receipt_${payment.receipt_number || 'download'}.pdf`
  );

  doc.pipe(res);

  // --- Colors ---
  const primaryColor = "#7c3aed"; // Violet-600
  const secondaryColor = "#1f2937"; // Gray-800
  const lightGray = "#f3f4f6"; // Gray-100
  const dividerColor = "#e5e7eb"; // Gray-200

  // --- Header Section ---
  // Background Strip
  doc.rect(0, 0, 595.28, 140).fill(lightGray);

  // Logo / Brand Name
  doc.fillColor(primaryColor)
    .fontSize(30)
    .font("Helvetica-Bold")
    .text("RentEase", 50, 45);

  doc.fillColor(secondaryColor)
    .fontSize(10)
    .font("Helvetica")
    .text("Premium Property Management", 50, 80);

  // Receipt Title & Status
  doc.fillColor(secondaryColor)
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("PAYMENT RECEIPT", 0, 45, { align: "right", width: 545 });

  doc.fillColor("#059669") // Emerald-600
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("PAID SUCCESSFUL", 0, 75, { align: "right", width: 545 });

  // --- Receipt Meta Info (Top Right) ---
  doc.fillColor("#6b7280") // Gray-500
    .fontSize(10)
    .font("Helvetica")
    .text(`Receipt #: ${payment.receipt_number || 'N/A'}`, 0, 95, { align: "right", width: 545 });

  doc.text(`Date: ${new Date(payment.payment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`, 0, 110, { align: "right", width: 545 });


  // --- Bill To Section ---
  doc.moveDown(5); // Move past header
  const startY = 170;

  doc.fillColor(secondaryColor).fontSize(12).font("Helvetica-Bold").text("Received From:", 50, startY);
  doc.fillColor("#4b5563").fontSize(10).font("Helvetica").text(payment.paid_by || "Tenant", 50, startY + 20);
  doc.text("Resident ID: " + (payment.tenant_id || "N/A"), 50, startY + 35);

  // Property Info (Right aligned in layout)
  doc.fillColor(secondaryColor).fontSize(12).font("Helvetica-Bold").text("Property Details:", 350, startY);
  doc.fillColor("#4b5563").fontSize(10).font("Helvetica").text("RentEase Properties", 350, startY + 20);
  // If we had property address in payment object we'd put it here


  // --- Payment Details Table ---
  const tableTop = 260;

  // Table Header
  doc.rect(50, tableTop, 495, 30).fill(secondaryColor);
  doc.fillColor("#ffffff").fontSize(10).font("Helvetica-Bold");
  doc.text("DESCRIPTION", 70, tableTop + 10);
  doc.text("PAYMENT METHOD", 300, tableTop + 10);
  doc.text("AMOUNT", 450, tableTop + 10, { width: 80, align: "right" });

  // Table Row
  const rowTop = tableTop + 30;
  doc.fillColor(secondaryColor).fontSize(10).font("Helvetica");

  // Row 1
  doc.text("Monthly Rent Payment", 70, rowTop + 15);

  // Method Logic
  let methodDisplay = payment.method || "Stripe";
  if (payment.ui_type === 'RAZORPAY_STYLE' && payment.payment_method_ui) {
    methodDisplay = `${payment.payment_method_ui.toUpperCase()} (Razorpay UI)`;
  }
  doc.text(methodDisplay, 300, rowTop + 15);

  doc.font("Helvetica-Bold").text(`₹${Number(payment.amount).toLocaleString()}`, 450, rowTop + 15, { width: 80, align: "right" });

  // Underline
  doc.moveTo(50, rowTop + 40).lineTo(545, rowTop + 40).strokeColor(dividerColor).stroke();

  // --- Totals Section ---
  const totalY = rowTop + 60;
  doc.fillColor(primaryColor)
    .fontSize(16)
    .font("Helvetica-Bold")
    .text(`Total Paid: ₹${Number(payment.amount).toLocaleString()}`, 0, totalY, { align: "right", width: 545 });

  doc.fillColor("#6b7280")
    .fontSize(10)
    .font("Helvetica-Oblique")
    .text("All prices in INR", 0, totalY + 25, { align: "right", width: 545 });


  // --- Transaction Meta ---
  doc.rect(50, 450, 495, 60).fill("#f9fafb"); // Very light gray box
  doc.strokeColor(dividerColor).lineWidth(1).rect(50, 450, 495, 60).stroke();

  doc.fillColor(secondaryColor).fontSize(10).font("Helvetica-Bold").text("Transaction Details", 70, 465);
  doc.fillColor("#6b7280").fontSize(9).font("Helvetica")
    .text(`Transaction ID: ${payment.transaction_id || payment.payment_id}`, 70, 485)
    .text(`Payment Gateway: ${payment.payment_gateway || 'Stripe'}`, 300, 485);


  // --- Footer ---
  const footerY = 750;
  doc.moveTo(50, footerY).lineTo(545, footerY).strokeColor(dividerColor).stroke();

  doc.fontSize(9).fillColor("#9ca3af").text("RentEase Inc. | support@rentease.com | +91 98765 43210", 50, footerY + 15, { align: "center", width: 495 });
  doc.text("Thank you for being a valued resident.", 50, footerY + 30, { align: "center", width: 495 });

  doc.end();
};
