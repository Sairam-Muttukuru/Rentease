const router = require("express").Router();
const controller = require("../../controllers/auth/AuthController");
const protect = require("../../middlewares/AuthMiddleware");

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.post("/forgot-password", controller.forgotPassword);
router.post("/verify-otp", controller.verifyOtp);
router.post("/reset-password", controller.resetPassword);
router.post("/change-password", protect, controller.changePassword);
router.put("/update-profile", protect, controller.updateProfile);

module.exports = router;
