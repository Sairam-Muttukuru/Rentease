const jwt = require("jsonwebtoken");
const { accessSecret } = require("../config/jwt");
const db = require("../config/db");

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token:", token);
    if (!token) return res.sendStatus(401);

    jwt.verify(token, accessSecret, async (err, decoded) => {
        if (err) return res.sendStatus(401);

        try {
            // High-security check: verify user is not blocked on every request
            const userCheck = await db.query("SELECT status FROM users WHERE id = $1", [decoded.id]);

            if (userCheck.rows.length === 0 || userCheck.rows[0].status === 'Blocked') {
                return res.status(403).json({ error: "Your account is blocked. Access denied." });
            }

            req.user = decoded;
            next();
        } catch (error) {
            console.error("Middleware check error:", error);
            res.sendStatus(500);
        }
    });
};
