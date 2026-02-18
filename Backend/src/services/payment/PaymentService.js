const stripe = require("../../config/stripe");
const db = require("../../config/db");
const sendReceiptEmail = require("../../utils/email/sendReceiptEmail");
const sendLandlordPaymentEmail = require("../../utils/email/sendLandlordPaymentEmail");
const generateReceipt = require("../../utils/helpers/generateReceipt");

class PaymentService {
    /**
     * Create a Stripe Payment Intent
     */
    async createPaymentIntent(amount) {
        if (!amount) throw new Error("Amount is required");

        const amountInPaise = Math.round(Number(amount) * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInPaise,
            currency: "inr",
            automatic_payment_methods: { enabled: true },
            metadata: { purpose: "Rent Payment" }
        });

        return { clientSecret: paymentIntent.client_secret };
    }

    /**
     * Save Rent Payment and trigger notifications/emails
     */
    async saveRentPayment({ tenant_id, property_id, amount, payment_date, due_date, transaction_id, paid_by }) {
        // 0. Check for Idempotency (Prevent double payments)
        const existing = await db.query("SELECT * FROM rent_payments WHERE transaction_id = $1", [transaction_id]);
        if (existing.rows.length > 0) {
            console.log(`[PaymentService] Duplicate rent payment detected for TX: ${transaction_id}. Returning existing.`);
            return existing.rows[0];
        }

        const receiptNumber = `RENT-${Date.now()}`;

        // 1. Save Payment Record
        const result = await db.query(
            `INSERT INTO rent_payments
            (tenant_id, property_id, amount, payment_date, due_date, status,
            payment_gateway, transaction_id, receipt_number, paid_by)
            VALUES ($1, $2, $3, $4, $5, 'PAID', 'Stripe', $6, $7, $8)
            RETURNING *`,
            [tenant_id, property_id, amount, payment_date, due_date, transaction_id, receiptNumber, paid_by]
        );

        const payment = result.rows[0];

        // 2. Update Tenant Status to PAID
        await db.query("UPDATE tenants SET payment_status = 'PAID' WHERE id = $1", [tenant_id]);

        // 3. Trigger Async Notifications (Fire and forget style in service, or handled by caller)
        this._handlePostPaymentNotifications(payment, tenant_id).catch(err => console.error("Post-payment notifications failed:", err));

        return payment;
    }

    /**
     * Save Security Deposit Payment
     */
    async saveSecurityDepositPayment({ tenant_id, property_id, amount, payment_date, transaction_id, paid_by, due_date }) {
        // 0. Check for Idempotency
        const existing = await db.query("SELECT * FROM rent_payments WHERE transaction_id = $1", [transaction_id]);
        if (existing.rows.length > 0) {
            console.log(`[PaymentService] Duplicate security deposit detected for TX: ${transaction_id}. Returning existing.`);
            return existing.rows[0];
        }

        const finalDueDate = due_date || payment_date;
        const receiptNumber = `SEC-DEP-${Date.now()}`;

        // Robust property_id resolution
        let effectivePropertyId = property_id;
        if (!effectivePropertyId) {
            const tenantCheck = await db.query("SELECT property_id FROM tenants WHERE id = $1", [tenant_id]);
            effectivePropertyId = tenantCheck.rows[0]?.property_id;
        }

        const result = await db.query(
            `INSERT INTO rent_payments
            (tenant_id, property_id, amount, payment_date, due_date, status,
            payment_gateway, transaction_id, receipt_number, paid_by)
            VALUES ($1, $2, $3, $4, $5, 'PAID', 'Stripe', $6, $7, $8)
            RETURNING *`,
            [tenant_id, effectivePropertyId, amount, payment_date, finalDueDate, transaction_id, receiptNumber, paid_by]
        );

        const payment = result.rows[0];

        // Update Security Deposit Status
        await db.query("UPDATE tenants SET security_deposit_status = 'Paid' WHERE id = $1", [tenant_id]);

        // Internal Notification via NotificationService
        const NotificationService = require("../common/NotificationService");
        try {
            const propRes = await db.query("SELECT landlord_id FROM properties WHERE id=$1", [effectivePropertyId]);
            if (propRes.rows.length > 0 && propRes.rows[0].landlord_id) {
                await NotificationService.createNotification(
                    propRes.rows[0].landlord_id,
                    'payment',
                    "Security Deposit Received",
                    `Security Deposit of ₹${amount} received from ${paid_by}.`
                );
            }
        } catch (notifierErr) {
            console.error("[PaymentService] Notification failed:", notifierErr);
        }

        return payment;
    }

    /**
     * Create Razorpay Payment (Demo Flow using Stripe abstraction)
     */
    async createRazorpayPayment({ amount, method, tenant_id, property_id, paid_by }) {
        if (!amount || !tenant_id) throw new Error("Missing required fields");

        const amountInPaise = Math.round(Number(amount) * 100);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInPaise,
            currency: "inr",
            automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
            metadata: { purpose: "Rent Payment (Razorpay UI Demo)", ui_method: method }
        });

        const receiptNumber = `RZP-DEMO-${Date.now()}`;

        const result = await db.query(
            `INSERT INTO rent_payments
            (tenant_id, property_id, amount, payment_date, due_date, status,
            payment_gateway, transaction_id, receipt_number, paid_by, ui_type, payment_method_ui)
            VALUES ($1,$2,$3,NOW(),NULL,'PAID','Stripe (Demo)',$4,$5,$6, 'RAZORPAY_STYLE', $7)
            RETURNING *`,
            [tenant_id, property_id, amount, paymentIntent.id, receiptNumber, paid_by, method]
        );

        await db.query("UPDATE tenants SET payment_status = 'PAID' WHERE id = $1", [tenant_id]);

        return {
            success: true,
            paymentId: paymentIntent.id,
            status: "succeeded",
            amount,
            receiptNumber,
            dbRecord: result.rows[0]
        };
    }

    /**
     * Get Payments for a Landlord
     */
    async getLandlordPayments(landlordId) {
        const query = `
            SELECT 
                rp.id, rp.amount, rp.payment_date as date, rp.status, 
                tm.full_name as tenant_name, p.title as property_name, rp.receipt_number
            FROM rent_payments rp
            JOIN properties p ON rp.property_id = p.id
            LEFT JOIN tenant_members tm ON tm.tenant_id = rp.tenant_id AND tm.is_primary = true
            WHERE p.landlord_id = $1
            ORDER BY rp.payment_date DESC
        `;
        const result = await db.query(query, [landlordId]);
        return result.rows;
    }

    /**
     * Download Receipt
     */
    async getPaymentByReceipt(paymentId) {
        const result = await db.query("SELECT * FROM rent_payments WHERE id = $1", [paymentId]);
        return result.rows[0];
    }

    /**
     * Get the latest Security Deposit payment for a tenant
     */
    async getSecurityDepositPayment(tenantId) {
        const result = await db.query(
            `SELECT * FROM rent_payments 
             WHERE tenant_id = $1 AND receipt_number LIKE 'SEC%' 
             ORDER BY payment_date DESC LIMIT 1`,
            [tenantId]
        );
        return result.rows[0];
    }

    /**
     * Private helper for emails and notifications
     */
    async _handlePostPaymentNotifications(payment, tenantId) {
        const tenantRes = await db.query("SELECT t.tenant_name, t.tenant_email, t.property_id FROM tenants t WHERE t.id = $1", [tenantId]);
        if (tenantRes.rows.length === 0) return;

        const tenant = tenantRes.rows[0];
        const propRes = await db.query(
            `SELECT p.title, p.landlord_id, u.email as landlord_email, u.full_name as landlord_name
             FROM properties p
             JOIN users u ON p.landlord_id = u.id
             WHERE p.id = $1`,
            [tenant.property_id]
        );

        if (propRes.rows.length === 0) return;
        const property = propRes.rows[0];

        // Send Emails
        await Promise.all([
            sendReceiptEmail(tenant.tenant_email, tenant.tenant_name, payment.amount, payment.payment_date, payment.transaction_id, property.title),
            sendLandlordPaymentEmail(property.landlord_email, property.landlord_name, tenant.tenant_name, payment.amount, property.title, payment.payment_date)
        ]);

        // Add Notification via NotificationService
        const NotificationService = require("../common/NotificationService");
        await NotificationService.createNotification(
            property.landlord_id,
            'payment',
            "Rent Received",
            `Rent of ₹${payment.amount} received from ${tenant.tenant_name} for ${property.title}.`
        );
    }
}

module.exports = new PaymentService();
