const db = require("../../config/db");
const sendSlotMail = require("../../utils/email/sendSlotMail");
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
