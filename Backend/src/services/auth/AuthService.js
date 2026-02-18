const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/common/UserModel");
const jwtConfig = require("../../config/jwt");
const sendMail = require("../../utils/email/sendOtpMail");

// In-memory OTP store: { email: { otp, expiresAt } }
const resetOtps = new Map();

const signup = async (data) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await User.createUser({
        ...data,
        password: hashedPassword
    });
};

const login = async (email, password) => {
    const user = await User.findUserByEmail(email);
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        jwtConfig.accessSecret,
        { expiresIn: jwtConfig.accessExpiry }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        jwtConfig.refreshSecret,
        { expiresIn: jwtConfig.refreshExpiry }
    );

    const userResponse = {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role
    };

    return { accessToken, refreshToken, user: userResponse };
};

// Generate and send OTP for password reset
const sendResetOtp = async (email) => {
    const user = await User.findUserByEmail(email);
    if (!user) throw new Error("No account found with this email");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    resetOtps.set(email, { otp, expiresAt });

    await sendMail(email, otp);
    return { message: "OTP sent to email" };
};

// Verify OTP for password reset
const verifyResetOtp = async (email, otp) => {
    const record = resetOtps.get(email);
    if (!record) throw new Error("OTP not found or expired");

    if (record.expiresAt < Date.now()) {
        resetOtps.delete(email);
        throw new Error("OTP expired");
    }

    if (record.otp !== otp) {
        throw new Error("Invalid OTP");
    }

    // Mark as verified by storing flag
    resetOtps.set(email, { ...record, verified: true });
    return { message: "OTP verified" };
};

// Reset password after OTP verification
const resetPassword = async (email, newPassword) => {
    const record = resetOtps.get(email);
    if (!record || !record.verified) {
        throw new Error("OTP verification required");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.updatePasswordByEmail(email, hashedPassword);

    // Clean up OTP record
    resetOtps.delete(email);

    if (!updatedUser) {
        throw new Error("Unable to update password");
    }

    return { message: "Password reset successful" };
};

const changePassword = async (userId, oldPassword, newPassword) => {
    const user = await User.findUserById(userId);
    if (!user) throw new Error("User not found");

    // Need to get the full user record to check the password (findUserById only returns specific fields)
    const fullUser = await User.findUserByEmail(user.email);

    const match = await bcrypt.compare(oldPassword, fullUser.password);
    if (!match) throw new Error("Incorrect current password");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePasswordByEmail(user.email, hashedPassword);

    return { message: "Password updated successfully" };
};

module.exports = { signup, login, sendResetOtp, verifyResetOtp, resetPassword, changePassword };
