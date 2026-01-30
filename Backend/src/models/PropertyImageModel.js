const db = require("../config/db");

exports.addImage = async (propertyId, imageUrl, isCover = false) => {
  return await db.query(
    `INSERT INTO property_images (property_id, image_url, is_cover)
     VALUES ($1,$2,$3)`,
    [propertyId, imageUrl, isCover]
  );
};

exports.getImagesByProperty = async (propertyId) => {
  return (await db.query(
    "SELECT * FROM property_images WHERE property_id = $1",
    [propertyId]
  )).rows;
};

/* ✅ THIS WAS MISSING */
exports.deleteImagesByProperty = async (propertyId) => {
  await db.query(
    "DELETE FROM property_images WHERE property_id = $1",
    [propertyId]
  );
};
