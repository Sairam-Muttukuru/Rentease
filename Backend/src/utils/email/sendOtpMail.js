const nodemailer = require("nodemailer");

const sendMail = async (to, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"RentEase" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: "RentEase Login OTP",
            html: `
                <h2>RentEase Login Verification</h2>
                <p>Your OTP is:</p>
                <h1 style="color: #4f46e5">${otp}</h1>
                <p>This OTP is valid for <b>5 minutes</b>.</p>
                <p>If you did not request this, please ignore.</p>
            `
        });

        console.log("OTP sent successfully");
    } catch (error) {
        console.error("Error sending OTP email:", error);
        throw new Error("Unable to send OTP email");
    }
};

module.exports = sendMail;
