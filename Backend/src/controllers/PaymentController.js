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

exports.saveSecurityDepositPayment = async (req, res) => {
    const logFile = "payment_debug.log";
    const log = (msg) => fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);

    try {
        log("Received saveSecurityDepositPayment request");
        log(`Body: ${JSON.stringify(req.body)}`);

        const {
            tenant_id,
            property_id,
            amount,
            payment_date,
            transaction_id,
            paid_by
        } = req.body;

        // Default due_date to payment_date if not provided (workaround for NOT NULL constraint)
        const due_date = req.body.due_date || payment_date;

        const receiptNumber = `SEC-DEP-${Date.now()}`;

        log("Executing INSERT query for Security Deposit...");
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

        // 1.5 Update Tenant Security Deposit Status to PAID
        log("Updating Tenant Security Deposit Status to PAID...");
        await db.query(
            "UPDATE tenants SET security_deposit_status = 'Paid' WHERE id = $1",
            [tenant_id]
        );

        // 2. Notifications (Simplified for now)
        await db.query(
            `INSERT INTO notifications 
            (user_id, title, message, type, is_read, created_at)
            VALUES ((SELECT landlord_id FROM properties WHERE id=$1), $2, $3, 'payment', false, NOW())`,
            [
                property_id,
                "Security Deposit Received",
                `Security Deposit of ₹${amount} received from ${paid_by}.`
            ]
        );

        res.json(payment);
    } catch (err) {
        log("ERROR in saveSecurityDepositPayment: " + err.message);
        console.error("Save deposit error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.createRazorpayPayment = async (req, res) => {
    const logFile = "payment_debug.log";
    const log = (msg) => fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);

    try {
        log("Received createRazorpayPayment request");
        const { amount, method, tenant_id, property_id, paid_by } = req.body;

        if (!amount || !tenant_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // 1. Create Stripe PaymentIntent (Backend abstraction)
        const amountInPaise = Math.round(Number(amount) * 100);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInPaise,
            currency: "inr",
            automatic_payment_methods: { enabled: true, allow_redirects: 'never' }, // minimal interaction
            metadata: {
                purpose: "Rent Payment (Razorpay UI Demo)",
                ui_method: method
            }
        });

        // 2. Auto-confirm logic for DEMO purposes (Since we are simulating the frontend flow)
        // In a real scenario, the FE would confirm. Here we trust the 'Pay' click.
        // Actually, to make it 'real', we should probably return the clientSecret and let the frontend confirm?
        // BUT the user said "Backend payment processing... Returns payment_id, status".
        // AND "Frontend... abstracts actual payment processing".
        // SO: We will create AND Confirm if possible, or just create and assume success for the DEMO nature if test card is used.
        // Stripe Test Card 'tok_visa' works for Charges, but for Intents we need steps.
        // SIMPLIFICATION: We will return the intent detailed, but ALSO Record it as if it succeeded immediately
        // because the user wants "After payment -> store details".

        const receiptNumber = `RZP-DEMO-${Date.now()}`;

        // 3. Record in DB immediately (Demo Flow)
        log("Recording Razorpay-style payment...");
        const result = await db.query(
            `INSERT INTO rent_payments
       (tenant_id, property_id, amount, payment_date, due_date, status,
        payment_gateway, transaction_id, receipt_number, paid_by, ui_type, payment_method_ui)
       VALUES ($1,$2,$3,NOW(),NULL,'PAID','Stripe (Demo)',$4,$5,$6, 'RAZORPAY_STYLE', $7)
       RETURNING *`,
            [
                tenant_id,
                property_id,
                amount,
                paymentIntent.id,
                receiptNumber,
                paid_by,
                method
            ]
        );

        // 4. Update Rent Status
        await db.query(
            "UPDATE tenants SET payment_status = 'PAID' WHERE id = $1",
            [tenant_id]
        );

        // 5. Log Activity
        // (Optional per requirements, but good practice)

        res.json({
            success: true,
            paymentId: paymentIntent.id,
            status: "succeeded",
            amount: amount,
            createdAt: Date.now(),
            receiptNumber: receiptNumber,
            dbRecord: result.rows[0]
        });

    } catch (err) {
        log("Razorpay Payment Error: " + err.message);
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
