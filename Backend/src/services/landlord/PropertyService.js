const Property = require("../../models/landlord/PropertyModel");
const Images = require("../../models/landlord/PropertyImageModel");
const Amenities = require("../../models/landlord/PropertyAmenityModel");
const { geocodeAddress } = require("../../utils/geocoder");

/* =======================
   CREATE PROPERTY
======================= */
exports.createProperty = async (landlordId, data) => {
  // Automatic Geocoding
  const fullAddress = `${data.address}, ${data.locality}, ${data.city}`;
  const coords = await geocodeAddress(fullAddress);

  const property = await Property.createProperty({
    landlord_id: landlordId,
    ...data,
    latitude: coords ? coords.lat : null,
    longitude: coords ? coords.lng : null
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
  return property;
};

/* =======================
   UPDATE PROPERTY
======================= */
exports.updateProperty = async (propertyId, landlordId, data) => {
  // 1️⃣ Update property basic details
  // Automatic Geocoding
  if (data.address || data.locality || data.city) {
    const fullAddress = `${data.address || ''}, ${data.locality || ''}, ${data.city || ''}`;
    const coords = await geocodeAddress(fullAddress);
    if (coords) {
      data.latitude = coords.lat;
      data.longitude = coords.lng;
    }
  }

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

  // 1️⃣ Fetch tenant details before deletion for notification
  // Since one property has one tenant in this system, we can safely fetch the single tenant
  try {
    const Tenant = require("../../models/tenant/TenantModel");
    const sendTenantRemovalEmail = require("../../utils/email/sendTenantRemovalEmail");
    
    const tenant = await Tenant.getByPropertyId(propertyId);
    if (tenant) {
      const tenantDetails = await Tenant.getDetailedById(tenant.id);
      if (tenantDetails && tenantDetails.tenant_email) {
        console.log(`[PropertyService] Sending removal email to tenant: ${tenantDetails.tenant_email}`);
        sendTenantRemovalEmail({
          tenantEmail: tenantDetails.tenant_email,
          tenantName: tenantDetails.tenant_name || "Tenant",
          landlordName: tenantDetails.landlord_name || "Your Landlord",
          propertyName: tenantDetails.property_name,
          propertyAddress: tenantDetails.property_address
        }).catch(err => console.error("[PropertyService] Failed to send tenant removal email:", err));
      }
    }
  } catch (err) {
    console.error("[PropertyService] Error during tenant notification (non-blocking):", err);
  }

  // 2️⃣ delete property (Model handles deletion of related images/amenities/tenants in a transaction)
  return await Property.deletePropertyWithRelations(propertyId, landlordId);
};

