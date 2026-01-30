const stripe = require("../config/stripe");
const db = require("../config/db");
const sendReceiptEmail = require("../utils/sendReceiptEmail");
const sendLandlordPaymentEmail = require("../utils/sendLandlordPaymentEmail");
const Tenant = require("../models/TenantModel");
const User = require("../models/UserModel");

exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body; // amount in INR

        console.log("💰 Init Payment. Amount:", amount);

        if (!amount) {
            return res.status(400).json({ error: "Amount is required" });
        }

        // Stripe expects integer logic (paise)
        const amountInPaise = Math.round(Number(amount) * 100);

        console.log("Stripe Amount (Paise):", amountInPaise);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInPaise,
            currency: "inr",
            automatic_payment_methods: { enabled: true },
            metadata: {
                purpose: "Rent Payment"
            }
        });

        console.log("✅ Payment Intent Created:", paymentIntent.id);

        res.json({
            clientSecret: paymentIntent.client_secret
        });

    } catch (err) {
        console.error("❌ Payment intent error:", err);
        res.status(500).json({ error: err.message });
    }
};

const fs = require("fs");

exports.saveRentPayment = async (req, res) => {
    const logFile = "payment_debug.log";
    const log = (msg) => fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);

    try {
        log("Received saveRentPayment request");
        log(`Body: ${JSON.stringify(req.body)}`);

        const {
            tenant_id,
            property_id,
            amount,
            payment_date,
            due_date,
            transaction_id,
            paid_by
        } = req.body;

        const receiptNumber = `RENT-${Date.now()}`;

        // 1. Save Payment Record
        log("Executing INSERT query...");
        const result = await db.query(
            `INSERT INTO rent_payments
       (tenant_id, property_id, amount, payment_date, due_date, status,
        payment_gateway, transaction_id, receipt_number, paid_by)
       VALUES ($1,$2,$3,$4,$5,'PAID','Stripe',$6,$7,$8)
       RETURNING *`,
            [
                tenant_id,
                property_id,
                amount,
                payment_date,
                due_date,
                transaction_id,
                receiptNumber,
                paid_by
            ]
        );

        log("INSERT Success. Result: " + JSON.stringify(result.rows[0]));

        const payment = result.rows[0];

        // 1.5 Update Tenant Status to PAID
        log("Updating Tenant Status to PAID...");
        await db.query(
            "UPDATE tenants SET payment_status = 'PAID' WHERE id = $1",
            [tenant_id]
        );

        // 2. Fetch Tenant & Landlord Details for Emails
        try {
            // Get Tenant Details
            const tenantRes = await db.query(
                "SELECT t.tenant_name, t.tenant_email, t.property_id FROM tenants t WHERE t.id = $1",
                [tenant_id]
            );

            if (tenantRes.rows.length > 0) {
                const tenant = tenantRes.rows[0];

                // Get Property & Landlord Details
                const propRes = await db.query(
                    `SELECT p.title, p.landlord_id, u.email as landlord_email, u.full_name as landlord_name
                     FROM properties p
                     JOIN users u ON p.landlord_id = u.id
                     WHERE p.id = $1`,
                    [tenant.property_id]
                );

                if (propRes.rows.length > 0) {
                    const property = propRes.rows[0];

                    log(`Sending emails. Tenant: ${tenant.tenant_email}, Landlord: ${property.landlord_email}`);

                    // Send Receipt to Tenant
                    await sendReceiptEmail(
                        tenant.tenant_email,
                        tenant.tenant_name,
                        amount,
                        payment.payment_date,
                        payment.transaction_id,
                        property.title
                    );

                    // Send Notification to Landlord
                    await sendLandlordPaymentEmail(
                        property.landlord_email,
                        property.landlord_name,
                        tenant.tenant_name,
                        amount,
                        property.title,
                        payment.payment_date
                    );

                    // 3. Add to Recent Activities (Notifications)
                    await db.query(
                        `INSERT INTO notifications 
                        (user_id, title, message, type, is_read, created_at)
                        VALUES ($1, $2, $3, 'payment', false, NOW())`,
                        [
                            property.landlord_id,
                            "Rent Received",
                            `Rent of ₹${amount} received from ${tenant.tenant_name} for ${property.title}.`,
                        ]
                    );

                    log("Notifications and Emails sent successfully.");
                }
            }
        } catch (emailErr) {
            log("Email/Notification Error: " + emailErr.message);
            console.error("Email/Notification Failed:", emailErr);
        }

        res.json(payment);
    } catch (err) {
        log("ERROR in saveRentPayment: " + err.message);
        console.error("Save payment error:", err);
        res.status(500).json({ error: err.message });
    }
};

const generateReceipt = require("../utils/generateReceipt");

exports.downloadReceipt = async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure we gracefully handle potential mock IDs if they somehow still leak through (though FE change should prevent this)
        if (!id || String(id).startsWith('pay_')) {
            return res.status(404).json({ error: "Invalid Receipt ID" });
        }

        const result = await db.query(
            "SELECT * FROM rent_payments WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Receipt not found" });
        }

        const payment = result.rows[0];

        // Use the backend utility to generate and pipe PDF
        generateReceipt(res, payment);

    } catch (err) {
        console.error("Download receipt error:", err);
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    }
}

exports.getLandlordPayments = async (req, res) => {
    try {
        const landlordId = req.user.id;

        // Join with properties to ensure we only get payments for properties owned by this landlord
        // Join with tenant_members to get the primary tenant's name
        const query = `
            SELECT 
                rp.id, 
                rp.amount, 
                rp.payment_date as date, 
                rp.status, 
                tm.full_name as tenant_name,
                p.title as property_name,
                rp.receipt_number
            FROM rent_payments rp
            JOIN properties p ON rp.property_id = p.id
            LEFT JOIN tenant_members tm ON tm.tenant_id = rp.tenant_id AND tm.is_primary = true
            WHERE p.landlord_id = $1
            ORDER BY rp.payment_date DESC
        `;

        const result = await db.query(query, [landlordId]);
        res.json(result.rows);
    } catch (err) {
        console.error("Get landlord payments error:", err);
        res.status(500).json({ error: err.message });
    }
};
