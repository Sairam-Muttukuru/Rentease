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
        const existingTx = await db.query("SELECT * FROM rent_payments WHERE transaction_id = $1", [transaction_id]);
        if (existingTx.rows.length > 0) {
            console.log(`[PaymentService] Duplicate rent payment detected for TX: ${transaction_id}. Returning existing.`);
            return existingTx.rows[0];
        }

        const receiptNumber = `RENT-${Date.now()}`;
        let effectiveDueDate = due_date;

        // Helper to get YYYY-MM-DD in local/IST safe means (noon-centered)
        const getYMD = (d) => {
            if (!d) return null;
            const date = new Date(d);
            date.setHours(12, 0, 0, 0);
            return date.getFullYear() + '-' + 
                   String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(date.getDate()).padStart(2, '0');
        };

        // --- Smart Rolling Due Date Logic ---
        if (!effectiveDueDate) {
            console.log(`[PaymentService] No due_date provided. Calculating oldest unpaid month for tenant ${tenant_id}...`);
            const tenantRes = await db.query("SELECT start_date, monthly_rent FROM tenants WHERE id = $1", [tenant_id]);
            if (tenantRes.rows.length > 0) {
                const tenant = tenantRes.rows[0];
                const startDate = new Date(tenant.start_date);
                const today = new Date();
                
                // Find oldest 31-day cycle that has NO payment
                let i = 0;
                while (true) {
                    const d = new Date(tenant.start_date);
                    d.setDate(d.getDate() + (i * 31));
                    const cycleDate = getYMD(d);
                    
                    const check = await db.query(
                        `SELECT id FROM rent_payments 
                         WHERE tenant_id = $1 
                         AND due_date = $2
                         AND receipt_number NOT LIKE 'SEC-DEP%'`,
                        [tenant_id, cycleDate]
                    );
                    
                    if (check.rows.length === 0) {
                        effectiveDueDate = cycleDate;
                        console.log(`[PaymentService] Assigned payment to 31-day cycle starting: ${effectiveDueDate} (IST Safe)`);
                        break;
                    }
                    i++;
                    // Safety break if we've checked many cycles (e.g. 5 years)
                    if (i > 60) break;
                }
            }
            if (!effectiveDueDate) {
                effectiveDueDate = new Date().toISOString().split('T')[0]; // Final fallback
            }
        }

        // Robust property_id resolution (always look up from tenant if not provided)
        let effectivePropertyId = property_id;
        if (!effectivePropertyId) {
            const tenantCheck = await db.query("SELECT property_id FROM tenants WHERE id = $1", [tenant_id]);
            effectivePropertyId = tenantCheck.rows[0]?.property_id;
            console.log(`[PaymentService] Resolved property_id from tenant: ${effectivePropertyId}`);
        }

        // 0.1 Strict Cycle Check: Prevent multiple 'PAID' status for same tenant cycle
        const alreadyPaid = await db.query(
            `SELECT * FROM rent_payments 
             WHERE tenant_id = $1 
             AND status = 'PAID'
             AND due_date = $2
             AND receipt_number NOT LIKE 'SEC-DEP%'`,
            [tenant_id, effectiveDueDate]
        );

        if (alreadyPaid.rows.length > 0) {
            console.log(`[PaymentService] Blocked duplicate payment attempt for Cycle: ${effectiveDueDate}`);
            throw new Error(`Rent for period starting ${effectiveDueDate} is already paid.`);
        }

        // --- Multi-Month Payment Splitting ---
        // If amount > monthly_rent, figure out how many months are covered
        const tenantRentRes = await db.query("SELECT monthly_rent, start_date FROM tenants WHERE id = $1", [tenant_id]);
        const monthlyRent = parseFloat(tenantRentRes.rows[0]?.monthly_rent) || parseFloat(amount);
        const monthsCovered = Math.max(1, Math.round(parseFloat(amount) / monthlyRent));

        // Find all consecutive unpaid cycles starting from effectiveDueDate
        const cyclesToPay = [];
        const allPaidDates = await db.query(
            `SELECT due_date FROM rent_payments WHERE tenant_id = $1 AND status = 'PAID' AND receipt_number NOT LIKE 'SEC-DEP%'`,
            [tenant_id]
        );
        const paidDatesSet = new Set(allPaidDates.rows.map(r => getYMD(r.due_date)).filter(Boolean));

        const tenantStartDate = new Date(tenantRentRes.rows[0]?.start_date || new Date());
        tenantStartDate.setHours(12, 0, 0, 0);
        
        // Scan from current effectiveDueDate's cycle index and collect 'monthsCovered' unpaid cycles
        let cyclesFound = 0;
        for (let i = 0; cyclesFound < monthsCovered && i < 120; i++) {
            const d = new Date(tenantStartDate);
            d.setDate(d.getDate() + (i * 31));
            const cycleYMD = getYMD(d);
            if (!paidDatesSet.has(cycleYMD)) {
                cyclesToPay.push({ cycleYMD, cycleDate: d });
                cyclesFound++;
            }
        }

        console.log(`[PaymentService] Splitting payment ₹${amount} across ${cyclesFound} cycles:`, cyclesToPay.map(c => c.cycleYMD));

        // 1. Insert one record per cycle covered (splitting the amount evenly)
        const amountPerCycle = Math.round((parseFloat(amount) / cyclesFound) * 100) / 100;
        let lastInsertedPayment = null;
        let lastCycleYMD = effectiveDueDate;

        for (let idx = 0; idx < cyclesToPay.length; idx++) {
            const { cycleYMD } = cyclesToPay[idx];
            const cycleReceiptNumber = cyclesToPay.length > 1 
                ? `${receiptNumber}-M${idx + 1}` 
                : receiptNumber;
            // Last cycle absorbs any rounding remainder
            const cycleAmount = idx === cyclesToPay.length - 1 
                ? Math.round((parseFloat(amount) - (amountPerCycle * (cyclesToPay.length - 1))) * 100) / 100
                : amountPerCycle;

            const res = await db.query(
                `INSERT INTO rent_payments
                (tenant_id, property_id, amount, payment_date, due_date, status,
                payment_gateway, transaction_id, receipt_number, paid_by)
                VALUES ($1, $2, $3, $4, $5, 'PAID', 'Stripe', $6, $7, $8)
                RETURNING *`,
                [tenant_id, effectivePropertyId, cycleAmount, payment_date, cycleYMD, transaction_id + (cyclesToPay.length > 1 ? `-${idx}` : ''), cycleReceiptNumber, paid_by]
            );
            lastInsertedPayment = res.rows[0];
            lastCycleYMD = cycleYMD;
        }

        const payment = lastInsertedPayment;

        // 2. Update Tenant Status and Last Paid Month (to the latest cycle covered)
        await db.query(
            "UPDATE tenants SET payment_status = 'PAID', last_paid_month = $2 WHERE id = $1",
            [tenant_id, lastCycleYMD]
        );

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

        // 3. Trigger Async Notifications
        this._handlePostPaymentNotifications(payment, tenant_id, "Security Deposit Received").catch(err => console.error("Post-payment notifications failed:", err));

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

        // Robust property_id resolution
        let effectivePropertyId = property_id;
        if (!effectivePropertyId) {
            const tenantCheck = await db.query("SELECT property_id FROM tenants WHERE id = $1", [tenant_id]);
            effectivePropertyId = tenantCheck.rows[0]?.property_id;
            console.log(`[PaymentService] Resolved property_id from tenant for Razorpay: ${effectivePropertyId}`);
        }

        const result = await db.query(
            `INSERT INTO rent_payments
            (tenant_id, property_id, amount, payment_date, due_date, status,
            payment_gateway, transaction_id, receipt_number, paid_by, ui_type, payment_method_ui)
            VALUES ($1,$2,$3,NOW(),NULL,'PAID','Stripe (Demo)',$4,$5,$6, 'RAZORPAY_STYLE', $7)
            RETURNING *`,
            [tenant_id, effectivePropertyId, amount, paymentIntent.id, receiptNumber, paid_by, method]
        );

        await db.query("UPDATE tenants SET payment_status = 'PAID' WHERE id = $1", [tenant_id]);

        // 3. Trigger Async Notifications
        this._handlePostPaymentNotifications(result.rows[0], tenant_id).catch(err => console.error("Post-payment notifications failed:", err));

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
                rp.id, rp.amount, rp.payment_date as date, 
                TO_CHAR(rp.payment_date AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') as local_date,
                rp.status, 
                tm.full_name as tenant_name,
                COALESCE(p.title, p2.title) as property_name,
                rp.receipt_number
            FROM rent_payments rp
            -- Join by direct property_id on the payment (may be null)
            LEFT JOIN properties p ON rp.property_id = p.id AND p.landlord_id = $1
            -- Fallback join via tenant's property_id (catches null property_id payments)
            LEFT JOIN tenants t ON t.id = rp.tenant_id
            LEFT JOIN properties p2 ON t.property_id = p2.id AND p2.landlord_id = $1
            LEFT JOIN tenant_members tm ON tm.tenant_id = rp.tenant_id AND tm.is_primary = true
            WHERE 
                (p.landlord_id = $1 OR p2.landlord_id = $1)
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
    async _handlePostPaymentNotifications(payment, tenant_id, customTitle = "Rent Received") {
        const tenantRes = await db.query(`
            SELECT u.email as tenant_email, CONCAT(u.first_name, ' ', u.last_name) as tenant_name, t.property_id 
            FROM tenants t 
            JOIN users u ON t.user_id = u.id 
            WHERE t.id = $1
        `, [tenant_id]);
        if (tenantRes.rows.length === 0) return;

        const tenant = tenantRes.rows[0];
        const propRes = await db.query(
            `SELECT p.title, p.landlord_id, u.email as landlord_email, 
             CONCAT(u.first_name, ' ', u.last_name) as landlord_name,
             (SELECT pi.image_url FROM property_images pi WHERE pi.property_id = p.id ORDER BY pi.is_cover DESC LIMIT 1) as property_image
             FROM properties p
             JOIN users u ON p.landlord_id = u.id
             WHERE p.id = $1`,
            [tenant.property_id]
        );

        if (propRes.rows.length === 0) return;
        const property = propRes.rows[0];

        // Send Emails
        try {
            await Promise.all([
                sendReceiptEmail(tenant.tenant_email, {
                    ...payment,
                    tenant_name: tenant.tenant_name,
                    property_title: property.title,
                    property_image: property.property_image
                }),
                sendLandlordPaymentEmail(property.landlord_email, {
                    ...payment,
                    landlord_name: property.landlord_name,
                    tenant_name: tenant.tenant_name,
                    property_title: property.title,
                    property_image: property.property_image
                })
            ]);
        } catch (emailErr) {
            console.error("[PaymentService] Email sending failed:", emailErr.message);
        }

        // Add Notification via NotificationService
        const NotificationService = require("../common/NotificationService");
        await NotificationService.createNotification(
            property.landlord_id,
            'payment',
            customTitle,
            `${customTitle} of ₹${payment.amount} received from ${tenant.tenant_name} for ${property.title}.`
        );
    }
}

module.exports = new PaymentService();
