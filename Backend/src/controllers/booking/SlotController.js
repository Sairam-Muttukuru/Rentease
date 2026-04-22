const db = require("../../config/db");
const sendSlotMail = require("../../utils/email/sendSlotMail");
const sendRescheduleMail = require("../../utils/email/sendRescheduleMail");
const ProviderModel = require("../../models/serviceProvider/ServiceProviderModel");

exports.createSlot = async (req, res) => {
    try {
        const { service_request_id, visit_date, start_time, end_time, worker_details } = req.body;

        const providerId = await ProviderModel.getProviderId(req.user.id);
        if (!providerId) {
            return res.status(404).json({ error: "Provider profile not found" });
        }

        // 1. Create the slot
        const slot = await db.query(
            `INSERT INTO service_slots 
            (service_request_id, provider_id, visit_date, start_time, end_time) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [service_request_id, providerId, visit_date, start_time, end_time]
        );

        // 2. Update service_requests with worker_details
        if (worker_details) {
            await db.query(
                `UPDATE service_requests SET worker_details = $1 WHERE id = $2`,
                [JSON.stringify(worker_details), service_request_id]
            );
        }

        // 3. Get user details for mail
        const user = await db.query(
            `SELECT u.email, u.first_name || ' ' || u.last_name as name, 
                    s.name as propertyName, 
                    s.image_url as propertyImage
             FROM users u 
             JOIN service_requests sr ON sr.user_id = u.id 
             JOIN services s ON s.id = sr.service_id
             WHERE sr.id=$1`,
            [service_request_id]
        );

        if (user.rows[0] && user.rows[0].email) {
            const mailData = {
                ...slot.rows[0],
                name: user.rows[0].name,
                propertyName: user.rows[0].propertyName,
                propertyImage: user.rows[0].propertyImage,
                worker_details: worker_details
            };
            // FIRE AND FORGET
            sendSlotMail(user.rows[0].email, mailData).catch(err => {
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
        const { service_request_id, visit_date, start_time, end_time, reason, worker_details } = req.body;

        const providerId = await ProviderModel.getProviderId(req.user.id);
        if (!providerId) {
            return res.status(404).json({ error: "Provider profile not found" });
        }

        // 1. Update the existing slot (or insert if none exists yet)
        let slot = await db.query(
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

        // If no existing slot, create a fresh one
        if (slot.rows.length === 0) {
            slot = await db.query(
                `INSERT INTO service_slots 
                 (service_request_id, provider_id, visit_date, start_time, end_time)
                 VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [service_request_id, providerId, visit_date, start_time, end_time]
            );
        }

        // 2. Update worker_details in service_requests (if provided)
        if (worker_details) {
            await db.query(
                `UPDATE service_requests SET worker_details = $1 WHERE id = $2`,
                [JSON.stringify(worker_details), service_request_id]
            );
        }

        // 3. Get customer + provider + service details for email
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
                reason,
                worker_details // Pass worker details to resched mail
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
