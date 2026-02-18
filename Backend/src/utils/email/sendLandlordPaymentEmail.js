const nodemailer = require("nodemailer");

const sendLandlordPaymentEmail = async (landlordEmail, payment) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        to: landlordEmail,
        subject: "💰 Rent Payment Received - RentEase",
        html: `
      <h2>Rent Payment Received</h2>
      <p><strong>Amount:</strong> ₹${payment.amount}</p>
      <p><strong>Receipt No:</strong> ${payment.receipt_number}</p>
      <p>The tenant has successfully paid the rent.</p>
      <p>Please login to RentEase dashboard for details.</p>
    `
    });
};

module.exports = sendLandlordPaymentEmail;
