const db = require("../../config/db");

exports.getAllAmenities = async (landlordId = null) => {
  // Return default amenities (user_id IS NULL) + landlord's custom amenities
  let query = "SELECT id, name FROM amenities WHERE user_id IS NULL";
  const params = [];
  
  if (landlordId) {
    query += " OR user_id = $1";
    params.push(landlordId);
  }
  
  query += " ORDER BY id ASC";
  
  const res = await db.query(query, params);
  return res.rows;
};

exports.addCustomAmenity = async (name, landlordId) => {
  const res = await db.query(
    "INSERT INTO amenities (name, user_id) VALUES ($1, $2) RETURNING id, name",
    [name, landlordId]
  );
  return res.rows[0];
};
