const db = require("../config/db");

exports.addAmenityToProperty = async (propertyId, amenityId) => {
  await db.query(
    `INSERT INTO property_amenities (property_id, amenity_id)
     VALUES ($1,$2)`,
    [propertyId, amenityId]
  );
};

exports.getAmenitiesByProperty = async (propertyId) => {
  return (await db.query(`
    SELECT a.id, a.name
    FROM amenities a
    JOIN property_amenities pa ON pa.amenity_id = a.id
    WHERE pa.property_id = $1
  `, [propertyId])).rows;
};

/* ✅ THIS WAS MISSING */
exports.removeAmenitiesFromProperty = async (propertyId) => {
  await db.query(
    "DELETE FROM property_amenities WHERE property_id = $1",
    [propertyId]
  );
};
