const router = require("express").Router();
const controller = require("../controllers/AuthController");
const Role = require("../middlewares/RoleMiddleware");

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.post("/forgot-password", controller.forgotPassword);
router.post("/verify-otp", controller.verifyOtp);
router.post("/reset-password", controller.resetPassword);
module.exports = router;
