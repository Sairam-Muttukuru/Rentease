const db = require("../../config/db");

exports.addImage = async (complaintId, imageUrl) => {
    return (await db.query(
        `INSERT INTO complaint_images (complaint_id, image_url) VALUES ($1, $2) RETURNING *`,
        [complaintId, imageUrl]
    )).rows[0];
};

exports.getImagesByComplaintId = async (complaintId) => {
    return (await db.query(
        `SELECT * FROM complaint_images WHERE complaint_id = $1`,
        [complaintId]
    )).rows;
};
