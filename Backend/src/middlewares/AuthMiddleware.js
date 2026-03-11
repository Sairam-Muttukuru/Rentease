const jwt = require("jsonwebtoken");
const { accessSecret } = require("../config/jwt");

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, accessSecret, (err, user) => {
        if (err) return res.sendStatus(401);
        req.user = user;
        next();
    });
};
