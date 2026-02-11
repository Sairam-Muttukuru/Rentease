const db = require("../config/db");
const { sendSlotMail } = require("../utils/mailer");

exports.createSlot = async (req, res) => {
    const { service_request_id, visit_date, start_time, end_time } = req.body;

    const slot = await db.query(
        `INSERT INTO service_slots
     (service_request_id, provider_id, visit_date, start_time, end_time)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [service_request_id, req.user.id, visit_date, start_time, end_time]
    );

    const user = await db.query(
        `SELECT u.email FROM users u
     JOIN service_requests sr ON sr.user_id = u.id
     WHERE sr.id=$1`,
        [service_request_id]
    );

    await sendSlotMail(user.rows[0].email, slot.rows[0]);
    res.json(slot.rows[0]);
};
