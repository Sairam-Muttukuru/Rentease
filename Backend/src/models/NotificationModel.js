const db = require("../config/db");

exports.create = async (data) => {
    return (await db.query(
        `
    INSERT INTO notifications
    (user_id, type, title, message)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
        [data.user_id, data.type, data.title, data.message]
    )).rows[0];
};

exports.getByUserId = async (userId) => {
    return (await db.query(
        `
    SELECT * FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
        [userId]
    )).rows;
};

exports.markAsRead = async (id) => {
    return (await db.query(
        `
    UPDATE notifications
    SET is_read = TRUE
    WHERE id = $1
    RETURNING *
    `,
        [id]
    )).rows[0];
};

exports.markAllAsRead = async (userId) => {
    return (await db.query(
        `
    UPDATE notifications
    SET is_read = TRUE
    WHERE user_id = $1
    RETURNING *
    `,
        [userId]
    )).rows;
};
