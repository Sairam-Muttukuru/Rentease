const { Pool } = require("pg");
require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const pool = new Pool({
    connectionString: "postgresql://rentease_user:XOVIC9upzv6MGDYp5zhidnn2S3PxGoG6@dpg-d6v39e9r0fns73c1j1q0-a.oregon-postgres.render.com/rentease_8222",
    ssl: {
        rejectUnauthorized: false,
    },
});

async function deleteTestProperty() {
  try {
    const propertyTitle = "Test Property";
    
    console.log("Connecting to Render DB...");
    // 1. Find the property ID
    console.log(`Searching for property titled: "${propertyTitle}" (case insensitive)...`);
    const res = await pool.query("SELECT id, title FROM properties WHERE title ILIKE $1", [propertyTitle]);
    console.log(`Found ${res.rows.length} matching properties.`);
    
    if (res.rows.length === 0) {
      console.log(`No property found in Render DB with title: ${propertyTitle}`);
      process.exit(0);
    }
    
    const propertyId = res.rows[0].id;
    console.log(`Found Remote property ID: ${propertyId}. Deleting...`);
    
    await pool.query("BEGIN");
    
    // Ordered deletion to handle constraints
    await pool.query("DELETE FROM property_images WHERE property_id = $1", [propertyId]);
    await pool.query("DELETE FROM property_amenities WHERE property_id = $1", [propertyId]);
    await pool.query("DELETE FROM bookings WHERE property_id = $1", [propertyId]);
    await pool.query("DELETE FROM announcements WHERE property_id = $1", [propertyId]);
    await pool.query("DELETE FROM complaint_images WHERE complaint_id IN (SELECT id FROM complaints WHERE property_id = $1)", [propertyId]);
    await pool.query("DELETE FROM complaints WHERE property_id = $1", [propertyId]);
    await pool.query("DELETE FROM rent_payments WHERE property_id = $1", [propertyId]);
    await pool.query("DELETE FROM tenant_members WHERE tenant_id IN (SELECT id FROM tenants WHERE property_id = $1)", [propertyId]);
    await pool.query("DELETE FROM tenants WHERE property_id = $1", [propertyId]);
    await pool.query("DELETE FROM service_updates WHERE service_request_id IN (SELECT id FROM service_requests WHERE property_id = $1)", [propertyId]);
    await pool.query("DELETE FROM provider_earnings WHERE service_request_id IN (SELECT id FROM service_requests WHERE property_id = $1)", [propertyId]);
    await pool.query("DELETE FROM service_slots WHERE service_request_id IN (SELECT id FROM service_requests WHERE property_id = $1)", [propertyId]);
    await pool.query("DELETE FROM reviews WHERE request_id IN (SELECT id FROM service_requests WHERE property_id = $1)", [propertyId]);
    await pool.query("DELETE FROM service_requests WHERE property_id = $1", [propertyId]);
    await pool.query("DELETE FROM properties WHERE id = $1", [propertyId]);
    
    await pool.query("COMMIT");
    console.log("Remote Property and all related data deleted successfully.");
    
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Error deleting remote property:", err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

deleteTestProperty();
