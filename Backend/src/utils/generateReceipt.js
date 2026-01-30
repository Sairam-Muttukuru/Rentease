const PDFDocument = require("pdfkit");

module.exports = (res, payment) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${payment.receipt_number}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(20).text("RentEase - Rent Receipt", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Receipt No: ${payment.receipt_number}`);
  doc.text(`Amount Paid: ₹${payment.amount}`);
  doc.text(`Status: ${payment.status}`);
  doc.text(`Transaction ID: ${payment.transaction_id}`);
  doc.text(`Payment Date: ${payment.payment_date}`);

  doc.end();
};
