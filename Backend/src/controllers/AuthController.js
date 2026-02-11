const AuthService = require("../services/AuthService");

exports.signup = async (req, res) => {
    try {
        const user = await AuthService.signup(req.body);
        res.status(201).json({ message: "Signup successful", user });
    } catch (err) {
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
            secure: false
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
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
