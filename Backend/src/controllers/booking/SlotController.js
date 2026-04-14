const db = require("../../config/db");
const sendSlotMail = require("../../utils/email/sendSlotMail");
const sendRescheduleMail = require("../../utils/email/sendRescheduleMail");
const ProviderModel = require("../../models/serviceProvider/ServiceProviderModel");

exports.createSlot = async (req, res) => {
    try {
        const { service_request_id, visit_date, start_time, end_time } = req.body;

        const providerId = await ProviderModel.getProviderId(req.user.id);
        if (!providerId) {
            return res.status(404).json({ error: "Provider profile not found" });
        }

        const slot = await db.query(
            `INSERT INTO service_slots 
            (service_request_id, provider_id, visit_date, start_time, end_time) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [service_request_id, providerId, visit_date, start_time, end_time]
        );

        const user = await db.query(
            `SELECT u.email FROM users u 
            JOIN service_requests sr ON sr.user_id = u.id 
            WHERE sr.id=$1`,
            [service_request_id]
        );

        if (user.rows[0] && user.rows[0].email) {
            // FIRE AND FORGET: Background email dispatch for zero UI delay
            sendSlotMail(user.rows[0].email, slot.rows[0]).catch(err => {
                console.error("Background Slot Email Error:", err.message);
            });
        }

        res.json(slot.rows[0]);
    } catch (err) {
        console.error("Create Slot Error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.rescheduleSlot = async (req, res) => {
    try {
        const { service_request_id, visit_date, start_time, end_time, reason } = req.body;

        const providerId = await ProviderModel.getProviderId(req.user.id);
        if (!providerId) {
            return res.status(404).json({ error: "Provider profile not found" });
        }

        // Update the existing slot (most recent one for this booking)
        const slot = await db.query(
            `UPDATE service_slots
             SET visit_date = $1, start_time = $2, end_time = $3, updated_at = NOW()
             WHERE service_request_id = $4 AND provider_id = $5
             AND id = (
                SELECT id FROM service_slots
                WHERE service_request_id = $4 AND provider_id = $5
                ORDER BY created_at DESC LIMIT 1
             )
             RETURNING *`,
            [visit_date, start_time, end_time, service_request_id, providerId]
        );

        if (slot.rows.length === 0) {
            return res.status(404).json({ error: "No existing slot found to reschedule" });
        }

        // Get customer + provider + service details for email
        const details = await db.query(
            `SELECT u.email, u.first_name || ' ' || u.last_name as customer_name,
                    s.name as service_name,
                    sp.company_name as provider_name
             FROM service_requests sr
             LEFT JOIN users u ON u.id = COALESCE(sr.user_id, (SELECT user_id FROM tenants WHERE id = sr.tenant_id))
             LEFT JOIN services s ON s.id = sr.service_id
             LEFT JOIN service_providers sp ON sp.id = $2
             WHERE sr.id = $1`,
            [service_request_id, providerId]
        );

        const row = details.rows[0];
        if (row && row.email) {
            // FIRE AND FORGET
            sendRescheduleMail(
                row.email,
                row.customer_name || 'Valued Customer',
                row.service_name || 'Your Service',
                row.provider_name || 'Service Provider',
                visit_date,
                start_time,
                end_time,
                reason
            ).catch(err => {
                console.error("Background Reschedule Email Error:", err.message);
            });
        }

        res.json({ ...slot.rows[0], reschedule_reason: reason });
    } catch (err) {
        console.error("Reschedule Slot Error:", err);
        res.status(500).json({ error: err.message });
    }
};
