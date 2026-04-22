const AuthService = require("../../services/auth/AuthService");
const User = require("../../models/common/UserModel");
const AuditService = require("../../services/common/AuditService");

exports.signup = async (req, res) => {
    try {
        const user = await AuthService.signup(req.body);
        res.status(201).json({ message: "Signup successful", user });
    } catch (err) {
        console.error("Signup error in Controller:", err);
        // Specifically handle PostgreSQL unique constraint violation (duplicate email)
        if (err.code === '23505') {
            return res.status(400).json({ error: "User already exists!" });
        }
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const tokens = await AuthService.login(
            req.body.email,
            req.body.password
        );

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        res.json({
            accessToken: tokens.accessToken,
            user: tokens.user
        });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};
exports.logout = (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,     // true in production (HTTPS)
        sameSite: "lax"    // MUST MATCH login
    });

    return res.status(200).json({
        message: "Logged out successfully"
    });
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await AuthService.sendResetOtp(email);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const result = await AuthService.verifyResetOtp(email, otp);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const result = await AuthService.resetPassword(email, newPassword);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const result = await AuthService.changePassword(
            req.user.id,
            currentPassword,
            newPassword
        );
        await AuditService.logUserAction(req.user.id, req.user.id, "Changed Password");
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await User.updateUser(userId, req.body);
        if (!result) throw new Error("Could not update profile");
        
        const fullName = `${result.first_name} ${result.last_name || ""}`.trim();
        await AuditService.logUserAction(userId, userId, "Updated Profile", `Name: ${fullName}`);
        
        res.status(200).json({ message: "Profile updated successfully", user: result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
