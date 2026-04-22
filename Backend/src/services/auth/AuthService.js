const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/common/UserModel");
const jwtConfig = require("../../config/jwt");
const sendMail = require("../../utils/email/sendOtpMail");
const sendWelcomeEmail = require("../../utils/email/sendWelcomeEmail");

// In-memory OTP store: { email: { otp, expiresAt } }
const resetOtps = new Map();

const signup = async (data) => {
    // Check if user already exists
    const existingUser = await User.findUserByEmail(data.email);
    if (existingUser) {
        throw new Error("User already exists!");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.createUser({
        ...data,
        password: hashedPassword
    });

    // 🔗 LINK: If this user was added to a property via email before signing up, link them now
    try {
        const Tenant = require("../../models/tenant/TenantModel");
        await Tenant.linkUserToTenants(data.email, user.id);
    } catch (linkError) {
        console.error("Failed to link tenant to user at signup:", linkError);
    }

    // Send welcome email asynchronously
    if (user && user.email) {
        sendWelcomeEmail(user.email, `${user.first_name} ${user.last_name}`).catch(err => 
            console.error("Failed to send welcome email:", err)
        );
    }

    return user;
};

const login = async (email, password) => {
    const user = await User.findUserByEmail(email);
    if (!user) throw new Error("User not found");

    if (user.status === 'Blocked') {
        throw new Error("Your account has been blocked. Please contact the administrator.");
    }

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
        role: user.role,
        avatar_url: user.avatar_url
    };

    // 🔗 LINK: Ensure tenant record is linked if not already (handles invites sent before or during existence)
    if (user.role?.toLowerCase() === 'tenant' || user.role?.toLowerCase() === 'user') {
        try {
            const Tenant = require("../../models/tenant/TenantModel");
            await Tenant.linkUserToTenants(user.email, user.id);
        } catch (linkError) {
            console.error("Failed to link tenant to user at login:", linkError);
        }
    }

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
