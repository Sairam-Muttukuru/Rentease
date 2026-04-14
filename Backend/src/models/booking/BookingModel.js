const db = require('../../config/db');

// Create table if not exists (Auto-migration for dev)
const initTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, CANCELLED
      visit_slot TIMESTAMP, -- Scheduled visit time if approved
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await db.query(query);
    // Migration: Add columns if they don't exist
    await db.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS visit_slot TIMESTAMP;`);
    await db.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS visited_at TIMESTAMP;`);
    console.log("Bookings table sanitized and fully migrated.");
  } catch (err) {
    console.error("Error creating/migrating bookings table:", err);
  }
};

// Initialize functionality
initTable();

exports.createBooking = async (userId, propertyId, message, visitSlot = null) => {
  const query = `
    INSERT INTO bookings (user_id, property_id, message, visit_slot)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  return (await db.query(query, [userId, propertyId, message, visitSlot])).rows[0];
};

exports.getBookingById = async (id) => {
  const query = `SELECT * FROM bookings WHERE id = $1`;
  return (await db.query(query, [id])).rows[0];
};

exports.getBookingsByUser = async (userId) => {
  const query = `
    SELECT b.*, p.title, p.price, p.city, p.locality, 
    (SELECT image_url FROM property_images WHERE property_id = p.id LIMIT 1) as image
    FROM bookings b
    JOIN properties p ON p.id = b.property_id
    WHERE b.user_id = $1
    ORDER BY b.created_at DESC;
  `;
  return (await db.query(query, [userId])).rows;
};

exports.getBookingsByProperty = async (propertyId) => {
  const query = `
    SELECT b.*, u.first_name, u.last_name, u.email, u.phone
    FROM bookings b
    JOIN users u ON u.id = b.user_id
    WHERE b.property_id = $1
    ORDER BY b.created_at DESC;
  `;
  return (await db.query(query, [propertyId])).rows;
};

exports.getBookingsByLandlord = async (landlordId) => {
  const query = `
    SELECT 
      b.id,
      b.status,
      b.created_at,
      b.visit_slot,
      b.visited_at,
      b.message,
      p.title as "propertyName",
      p.locality || ', ' || p.city as location,
      u.first_name || ' ' || u.last_name as "tenantName",
      u.email,
      'Tenant' as "userType"
    FROM bookings b
    JOIN properties p ON p.id = b.property_id
    JOIN users u ON u.id = b.user_id
    WHERE p.landlord_id = $1
    ORDER BY b.created_at DESC;
  `;
  return (await db.query(query, [landlordId])).rows;
};

exports.updateStatus = async (bookingId, status, visitSlot = null) => {
  // Normalize status to UPPERCASE to match DB constraints and checkExistingBooking logic
  const normalizedStatus = status ? status.toUpperCase() : status;
  let query, params;
  if (visitSlot) {
    query = `
      UPDATE bookings 
      SET status = $1, 
          visit_slot = $2,
          visited_at = CASE WHEN $3 = 'VISITED' THEN NOW() ELSE visited_at END,
          updated_at = NOW()
      WHERE id = $4
      RETURNING *;
    `;
    params = [normalizedStatus, visitSlot, normalizedStatus, bookingId];
  } else {
    query = `
      UPDATE bookings 
      SET status = $1, 
          visited_at = CASE WHEN $2 = 'VISITED' THEN NOW() ELSE visited_at END,
          updated_at = NOW()
      WHERE id = $3
      RETURNING *;
    `;
    params = [normalizedStatus, normalizedStatus, bookingId];
  }
  return (await db.query(query, params)).rows[0];
};

// Check if user already acted on this property
exports.checkExistingBooking = async (userId, propertyId) => {
  const query = `SELECT * FROM bookings WHERE user_id=$1 AND property_id=$2 AND status IN ('PENDING', 'APPROVED')`;
  return (await db.query(query, [userId, propertyId])).rows[0];
};
