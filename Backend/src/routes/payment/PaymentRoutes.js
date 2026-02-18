const router = require("express").Router();
const controller = require("../../controllers/payment/PaymentController");
const auth = require("../../middlewares/AuthMiddleware");

router.post("/create-payment-intent", auth, controller.createPaymentIntent);
router.post("/create-razorpay", auth, controller.createRazorpayPayment);
router.post("/rent-payment", auth, controller.saveRentPayment);
router.post("/security-deposit", auth, controller.saveSecurityDepositPayment);
router.get("/security-deposit/tenant/:tenantId", auth, controller.getSecurityDeposit);
router.get("/download-receipt/:id", auth, controller.downloadReceipt);
router.get("/landlord-payments", auth, controller.getLandlordPayments);
module.exports = router;
