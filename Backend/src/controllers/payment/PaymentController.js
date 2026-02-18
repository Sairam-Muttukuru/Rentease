const PaymentService = require("../../services/payment/PaymentService");
const generateReceipt = require("../../utils/helpers/generateReceipt");

exports.createPaymentIntent = async (req, res) => {
    try {
        const result = await PaymentService.createPaymentIntent(req.body.amount);
        res.json(result);
    } catch (err) {
        console.error("❌ Payment intent error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.saveRentPayment = async (req, res) => {
    try {
        const payment = await PaymentService.saveRentPayment(req.body);
        res.json(payment);
    } catch (err) {
        console.error("Save payment error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.saveSecurityDepositPayment = async (req, res) => {
    try {
        const payment = await PaymentService.saveSecurityDepositPayment(req.body);
        res.json(payment);
    } catch (err) {
        console.error("Save deposit error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.createRazorpayPayment = async (req, res) => {
    try {
        const result = await PaymentService.createRazorpayPayment(req.body);
        res.json(result);
    } catch (err) {
        console.error("Razorpay Payment Error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.downloadReceipt = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || String(id).startsWith('pay_')) {
            return res.status(404).json({ error: "Invalid Receipt ID" });
        }

        const payment = await PaymentService.getPaymentByReceipt(id);
        if (!payment) {
            return res.status(404).json({ error: "Receipt not found" });
        }

        generateReceipt(res, payment);
    } catch (err) {
        console.error("Download receipt error:", err);
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    }
}

exports.getSecurityDeposit = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const payment = await PaymentService.getSecurityDepositPayment(tenantId);
        if (!payment) {
            return res.status(404).json({ error: "Security deposit record not found" });
        }
        res.json(payment);
    } catch (err) {
        console.error("Get security deposit error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.getLandlordPayments = async (req, res) => {
    try {
        const payments = await PaymentService.getLandlordPayments(req.user.id);
        res.json(payments);
    } catch (err) {
        console.error("Get landlord payments error:", err);
        res.status(500).json({ error: err.message });
    }
};
