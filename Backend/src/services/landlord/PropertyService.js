const Property = require("../../models/landlord/PropertyModel");
const Images = require("../../models/landlord/PropertyImageModel");
const Amenities = require("../../models/landlord/PropertyAmenityModel");

/* =======================
   CREATE PROPERTY
======================= */
exports.createProperty = async (landlordId, data) => {
  const property = await Property.createProperty({
    landlord_id: landlordId,
    ...data
  });

  // images
  if (data.images?.length) {
    for (const img of data.images) {
      const url = img.url || img.image_url;
      if (url) {
        await Images.addImage(property.id, url, img.is_cover || false);
      }
    }
  }

  // amenities
  if (data.amenities?.length) {
    for (const amenityId of data.amenities) {
      await Amenities.addAmenityToProperty(property.id, amenityId);
    }
  }

  return property;
};

/* =======================
   GET ALL PROPERTIES
======================= */
/* =======================
   GET ALL PROPERTIES
======================= */
exports.getAllProperties = async (filters) => {
  const properties = await Property.getAllProperties(filters);

  // Populate images and amenities for each property
  // Note: The SQL query already does some of this, but if we need full object hydration:
  // The SQL uses json_agg for efficiency. We might not need the loops below if the SQL returns correct structure.
  // The new SQL returns 'images' and 'amenities' as JSON arrays. 
  // We can skip the N+1 queries here!

  // However, check strictly if the SQL was returning what we expect. 
  // references: PropertyModel.js lines 79-88 (in original) and in my edit.
  // My edit INCLUDES json_agg for images and amenities.
  // So the loops below are REDUNDANT and SLOW. I will remove them.

  return properties;
};

exports.getPropertiesCount = async (filters) => {
  return await Property.getPropertiesCount(filters);
};

/* =======================
   GET PROPERTIES BY LANDLORD
======================= */
exports.getPropertiesByLandlord = async (landlordId) => {
  const properties = await Property.getPropertiesByLandlordId(landlordId);

  // Populate images and amenities for each property
  for (const property of properties) {
    property.images = await Images.getImagesByProperty(property.id);
    property.amenities = await Amenities.getAmenitiesByProperty(property.id);
  }

  return properties;
};

/* =======================
   GET PROPERTY DETAILS
======================= */
exports.getPropertyDetails = async (propertyId) => {
  const property = await Property.getPropertyById(propertyId);
  if (!property) throw new Error("Property not found");

  property.images = await Images.getImagesByProperty(propertyId);
  property.amenities = await Amenities.getAmenitiesByProperty(propertyId);

  return property;
};

/* =======================
   UPDATE PROPERTY
======================= */
exports.updateProperty = async (propertyId, landlordId, data) => {
  // 1️⃣ Update property basic details
  const updatedProperty = await Property.updateProperty(
    propertyId,
    landlordId,
    data
  );

  if (!updatedProperty) {
    throw new Error("Unauthorized or property not found");
  }

  // 2️⃣ Update images (if sent)
  if (data.images) {
    await Images.deleteImagesByProperty(propertyId);

    for (let img of data.images) {
      const url = img.url || img.image_url;
      if (url) {
        await Images.addImage(propertyId, url, img.is_cover);
      }
    }
  }

  // 3️⃣ Update amenities (if sent)
  if (data.amenities) {
    await Amenities.removeAmenitiesFromProperty(propertyId);

    for (let amenityId of data.amenities) {
      await Amenities.addAmenityToProperty(propertyId, amenityId);
    }
  }

  return updatedProperty;
};


// exports.updateProperty = async (propertyId, landlordId, data) => {
//   const updatedProperty = await Property.updateProperty(
//     propertyId,
//     landlordId,
//     data
//   );

//   if (!updatedProperty) {
//     throw new Error("Unauthorized or property not found");
//   }

//   return updatedProperty;
// };


/* =======================
   DELETE PROPERTY
======================= */
exports.deleteProperty = async (propertyId, landlordId) => {
  const property = await Property.getPropertyById(propertyId);

  if (!property || property.landlord_id !== landlordId) {
    throw new Error("Unauthorized or property not found");
  }

  // delete property (Model handles deletion of related images/amenities in a transaction)
  return await Property.deletePropertyWithRelations(propertyId, landlordId);
};
