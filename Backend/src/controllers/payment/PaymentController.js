const PaymentService = require("../../services/payment/PaymentService");
const AuditService = require("../../services/common/AuditService");
const generateReceipt = require("../../utils/helpers/generateReceipt");
const generateServiceReceipt = require("../../utils/helpers/generateServiceReceipt");
const db = require("../../config/db");
const sendServicePaymentEmail = require("../../utils/email/sendServicePaymentEmail");
const SocketService = require("../../services/common/SocketService");
const NotificationService = require("../../services/common/NotificationService");
const ProviderModel = require("../../models/serviceProvider/ServiceProviderModel");

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
        await AuditService.logTenantAction(req.body.landlord_id || "N/A", req.body.tenant_id, req.body.property_id || "N/A", "Paid Rent", `Amount: ₹${req.body.amount}`);
        res.json(payment);
    } catch (err) {
        console.error("Save payment error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.saveSecurityDepositPayment = async (req, res) => {
    try {
        const payment = await PaymentService.saveSecurityDepositPayment(req.body);
        await AuditService.logTenantAction(req.body.landlord_id || "N/A", req.body.tenant_id, req.body.property_id || "N/A", "Paid Security Deposit", `Amount: ₹${req.body.amount}`);
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

/**
 * Pay for a completed service online
 */
exports.saveServicePayment = async (req, res) => {
    try {
        const { service_request_id, amount } = req.body;
        if (!service_request_id || !amount) {
            return res.status(400).json({ error: "service_request_id and amount are required" });
        }

        // 1. Fetch booking details
        const bookingRes = await db.query(`
            SELECT 
                sr.*,
                s.name as service_name,
                CONCAT(u.first_name, ' ', u.last_name) as payer_name,
                u.email as payer_email,
                sp.company_name as provider_name,
                pu.email as provider_email
            FROM service_requests sr
            LEFT JOIN services s ON s.id = sr.service_id
            LEFT JOIN users u ON u.id = sr.user_id
            LEFT JOIN service_providers sp ON sp.id = sr.assigned_provider_id
            LEFT JOIN users pu ON pu.id = sp.user_id
            WHERE sr.id = $1
        `, [service_request_id]);

        if (!bookingRes.rows[0]) {
            return res.status(404).json({ error: "Service booking not found" });
        }

        const booking = bookingRes.rows[0];

        // 2. Guard: only allow when Completed + not yet paid
        if (booking.status?.toUpperCase() !== 'COMPLETED') {
            return res.status(400).json({ error: "Service must be Completed before payment" });
        }
        if (booking.service_payment_status === 'PAID') {
            return res.status(400).json({ error: "This service has already been paid" });
        }

        // 3. Generate receipt number
        const receiptNumber = `SVC-${Date.now()}`;

        // 4. Mark service as paid
        await db.query(
            `UPDATE service_requests SET service_payment_status = 'PAID', service_receipt_number = $2 WHERE id = $1`,
            [service_request_id, receiptNumber]
        );

        // 5. Build payment data for receipt/email
        const paymentData = {
            service_request_id,
            amount,
            receipt_number: receiptNumber,
            payment_date: new Date(),
            service_name: booking.service_name,
            payer_name: booking.payer_name,
            provider_name: booking.provider_name,
            property_address: booking.address
        };

        // 6. Notifications (In-app + Real-time)
        try {
            // Get provider user_id to send notification
            const provider = await ProviderModel.getById(booking.assigned_provider_id);
            if (provider && provider.user_id) {
                const title = "Service Payment Received";
                const msg = `Good news! Online payment of ₹${amount} received from ${booking.payer_name} for ${booking.service_name}.`;
                
                // Save notification
                await NotificationService.createNotification(provider.user_id, 'payment', title, msg);
                
                // Emit real-time socket event
                SocketService.emitToUser(provider.user_id, "new_notification", {
                    type: "payment",
                    title,
                    message: msg,
                    bookingId: service_request_id
                });
            }
        } catch (notifErr) {
            console.error("[ServicePayment] Notification error:", notifErr.message);
        }

        // 7. Emails
        // A. Email provider ("Amount Received")
        if (booking.provider_email) {
            sendServicePaymentEmail(booking.provider_email, {
                ...paymentData,
                subject: "Service Payment Received",
                type: "provider"
            }).catch(err => console.error("[ServicePayment] Provider email error:", err.message));
        }

        // B. Email payer (Receipt)
        if (booking.payer_email) {
            sendServicePaymentEmail(booking.payer_email, {
                ...paymentData,
                subject: "Service Payment Receipt",
                type: "payer"
            }).catch(err => console.error("[ServicePayment] Payer email error:", err.message));
        }

        // 8. Audit log
        AuditService.logUserAction(
            req.user.id, req.user.id,
            "Service Payment Made",
            `Paid Rs.${amount} for service request #${service_request_id}`
        ).catch(() => {});

        res.json({ success: true, receipt_number: receiptNumber, message: "Payment recorded successfully" });
    } catch (err) {
        console.error("Service payment error:", err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Download service receipt PDF
 */
exports.downloadServiceReceipt = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(`
            SELECT 
                sr.*,
                s.name as service_name,
                CONCAT(u.first_name, ' ', u.last_name) as payer_name,
                sp.company_name as provider_name
            FROM service_requests sr
            LEFT JOIN services s ON s.id = sr.service_id
            LEFT JOIN users u ON u.id = COALESCE(sr.user_id, (SELECT user_id FROM tenants WHERE id = sr.tenant_id LIMIT 1))
            LEFT JOIN service_providers sp ON sp.id = sr.assigned_provider_id
            WHERE sr.service_receipt_number = $1
        `, [id]);

        if (!result.rows[0]) {
            return res.status(404).json({ error: "Receipt not found" });
        }

        const booking = result.rows[0];
        const paymentData = {
            receipt_number: booking.service_receipt_number,
            amount: booking.amount,
            payment_date: new Date(),
            service_name: booking.service_name,
            payer_name: booking.payer_name,
            provider_name: booking.provider_name,
            property_address: booking.address
        };

        await generateServiceReceipt(res, paymentData);
    } catch (err) {
        console.error("Download service receipt error:", err);
        if (!res.headersSent) res.status(500).json({ error: err.message });
    }
};
