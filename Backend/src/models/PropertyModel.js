const db = require("../config/db");

/* =========================
   CREATE PROPERTY
========================= */
exports.createProperty = async (data) => {
  const query = `
    INSERT INTO properties
    (landlord_id, title, description, property_type, price,
     orientation, bedrooms, bathrooms, area_sqft,
     city, locality, address, is_featured,
     building_name, flat_number, floor_number, bhk,
     is_gated, total_floors, has_lift, parking_type, house_floor_type,
     duplex_type, private_parking_slots, private_garden,
     room_type, food_included, electricity_included, gender_allowed,
     shop_use_type, water_available,
     office_type, seating_capacity, cabins_available, conference_room)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35)
    RETURNING *;
  `;

  const values = [
    data.landlord_id,
    data.title,
    data.description,
    data.property_type,
    data.price,
    data.orientation,
    data.bedrooms,
    data.bathrooms,
    data.area_sqft,
    data.city,
    data.locality,
    data.address,
    data.is_featured || false,
    // Apartment specific fields (or null if not provided)
    data.building_name || null,
    data.flat_number || null,
    data.floor_number || null,
    data.bhk || null,
    data.is_gated || false,
    data.total_floors || null,
    data.has_lift || false,
    data.parking_type || null,
    data.house_floor_type || null,
    data.duplex_type || false,
    data.private_parking_slots || 0,
    data.private_garden || false,
    // PG / Hostel specific fields
    data.room_type || null,
    data.food_included || false,
    data.electricity_included || false,

    data.gender_allowed || null,
    // Commercial Shop specific fields
    data.shop_use_type || null,
    data.water_available || false,
    // Office Space specific fields
    data.office_type || null,
    data.seating_capacity || null,
    data.cabins_available || false,
    data.conference_room || false
  ];

  return (await db.query(query, values)).rows[0];
};

/* =========================
   GET ALL PROPERTIES
========================= */
exports.getAllProperties = async () => {
  const query = `
    SELECT 
      p.*,
      u.first_name,
      u.last_name,
      u.email,
      (CASE WHEN (SELECT COUNT(*) FROM tenants t WHERE t.property_id = p.id) > 0 THEN 'Occupied' ELSE 'Available' END) as status,
      COALESCE(
        (SELECT json_agg(json_build_object('url', pi.image_url, 'is_cover', pi.is_cover))
         FROM property_images pi
         WHERE pi.property_id = p.id)
      , '[]') as images,
      COALESCE(
        (SELECT json_agg(json_build_object('id', pa.amenity_id))
         FROM property_amenities pa
         WHERE pa.property_id = p.id)
      , '[]') as amenities
    FROM properties p
    JOIN users u ON u.id = p.landlord_id
    ORDER BY p.created_at DESC
  `;
  return (await db.query(query)).rows;
};

/* =========================
   GET PROPERTIES BY LANDLORD ID
========================= */
exports.getPropertiesByLandlordId = async (landlordId) => {
  const query = `
    SELECT 
      p.*,
      u.first_name,
      u.last_name,
      u.email,
      (SELECT COUNT(*) FROM tenants t WHERE t.property_id = p.id) as tenant_count,
      (CASE WHEN (SELECT COUNT(*) FROM tenants t WHERE t.property_id = p.id) > 0 THEN 'Occupied' ELSE 'Available' END) as status,
      COALESCE(
        (SELECT json_agg(json_build_object('url', pi.image_url, 'is_cover', pi.is_cover))
         FROM property_images pi
         WHERE pi.property_id = p.id)
      , '[]') as images,
      COALESCE(
        (SELECT json_agg(json_build_object('id', pa.amenity_id))
         FROM property_amenities pa
         WHERE pa.property_id = p.id)
      , '[]') as amenities
    FROM properties p
    JOIN users u ON u.id = p.landlord_id
    WHERE p.landlord_id = $1
    ORDER BY p.created_at DESC
  `;
  return (await db.query(query, [landlordId])).rows;
};

/* =========================
   GET PROPERTY BY ID
========================= */
exports.getPropertyById = async (id) => {
  const query = `
    SELECT 
      p.*,
      u.first_name,
      u.last_name,
      u.email,
      (CASE WHEN (SELECT COUNT(*) FROM tenants t WHERE t.property_id = p.id) > 0 THEN 'Occupied' ELSE 'Available' END) as status,
      COALESCE(
        (SELECT json_agg(json_build_object('url', pi.image_url, 'is_cover', pi.is_cover))
         FROM property_images pi
         WHERE pi.property_id = p.id)
      , '[]') as images,
      COALESCE(
        (SELECT json_agg(json_build_object('id', pa.amenity_id))
         FROM property_amenities pa
         WHERE pa.property_id = p.id)
      , '[]') as amenities
    FROM properties p
    JOIN users u ON u.id = p.landlord_id
    WHERE p.id = $1
  `;
  return (await db.query(query, [id])).rows[0];
};



/* =========================
   UPDATE PROPERTY (LANDLORD)
========================= */
exports.updateProperty = async (id, landlordId, data) => {
  const query = `
    UPDATE properties
    SET
      title = $1,
      description = $2,
      property_type = $3,
      price = $4,
      orientation = $5,
      bedrooms = $6,
      bathrooms = $7,
      area_sqft = $8,
      city = $9,
      locality = $10,
      address = $11,
      is_featured = $12,
      building_name = $13,
      flat_number = $14,
      floor_number = $15,
      bhk = $16,
      is_gated = $17,
      total_floors = $18,
      has_lift = $19,
      parking_type = $20,
      duplex_type = $21,
      private_parking_slots = $22,
      private_garden = $23,
      room_type = $24,
      food_included = $25,
      electricity_included = $26,
      gender_allowed = $27,
      shop_use_type = $28,
      water_available = $29,
      office_type = $30,
      seating_capacity = $31,
      cabins_available = $32,
      conference_room = $33,
      updated_at = NOW()
    WHERE id = $34 AND landlord_id = $35
    RETURNING *;
  `;

  const values = [
    data.title,
    data.description,
    data.property_type,
    data.price,
    data.orientation,
    data.bedrooms,
    data.bathrooms,
    data.area_sqft,
    data.city,
    data.locality,
    data.address,
    data.is_featured,
    data.building_name || null,
    data.flat_number || null,
    data.floor_number || null,
    data.bhk || null,
    data.is_gated || false,
    data.total_floors || null,
    data.has_lift || false,
    data.parking_type || null,
    data.duplex_type || false,
    data.private_parking_slots || 0,
    data.private_garden || false,

    // PG / Hostel
    data.room_type,
    data.food_included,
    data.electricity_included,
    data.gender_allowed,
    // Commercial Shop
    data.shop_use_type,
    data.water_available,
    // Office Space
    data.office_type,
    data.seating_capacity,
    data.cabins_available,
    data.conference_room,
    id,
    landlordId
  ];

  return (await db.query(query, values)).rows[0];
};

/* =========================
   DELETE PROPERTY (LANDLORD)
========================= */
exports.deletePropertyWithRelations = async (propertyId, landlordId) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // ✅ Ownership check
    const check = await client.query(
      "SELECT id FROM properties WHERE id=$1 AND landlord_id=$2",
      [propertyId, landlordId]
    );

    if (check.rowCount === 0) {
      throw new Error("Unauthorized or property not found");
    }

    // ✅ Delete images
    await client.query(
      "DELETE FROM property_images WHERE property_id=$1",
      [propertyId]
    );

    // ✅ Delete amenities
    await client.query(
      "DELETE FROM property_amenities WHERE property_id=$1",
      [propertyId]
    );

    // ✅ Delete property
    await client.query(
      "DELETE FROM properties WHERE id=$1",
      [propertyId]
    );

    await client.query("COMMIT");
    return true;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};