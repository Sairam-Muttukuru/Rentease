const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");

const sendReceiptEmail = async (tenantEmail, payment) => {
    // 1️⃣ Create PDF in memory
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
        const pdfData = Buffer.concat(buffers);

        // 2️⃣ Mail setup
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 3️⃣ Send email with attachment
        await transporter.sendMail({
            to: tenantEmail,
            subject: "🧾 Rent Payment Receipt - RentEase",
            html: `
        <h2>Payment Successful</h2>
        <p>Receipt No: ${payment.receipt_number}</p>
        <p>Amount Paid: ₹${payment.amount}</p>
        <p>Thank you for paying your rent.</p>
      `,
            attachments: [
                {
                    filename: `${payment.receipt_number}.pdf`,
                    content: pdfData
                }
            ]
        });
    });

    // 4️⃣ PDF content
    doc.fontSize(20).text("RentEase - Rent Receipt", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Receipt No: ${payment.receipt_number}`);
    doc.text(`Amount: ₹${payment.amount}`);
    doc.text(`Transaction ID: ${payment.transaction_id}`);
    doc.text(`Status: Paid`);
    doc.text(`Date: ${payment.payment_date}`);
    doc.end();
};

module.exports = sendReceiptEmail;
