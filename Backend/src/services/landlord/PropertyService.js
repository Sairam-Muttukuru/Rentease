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
  
  // Fetch current property to check if geocoding is needed
  const currentProperty = await Property.getPropertyById(propertyId);
  if (!currentProperty) {
    throw new Error("Property not found");
  }

  // Only geocode if the address components actually changed
  const addressChanged = 
    data.address !== currentProperty.address || 
    data.locality !== currentProperty.locality || 
    data.city !== currentProperty.city;

  if (addressChanged && (data.address || data.locality || data.city)) {
    const fullAddress = `${data.address || ''}, ${data.locality || ''}, ${data.city || ''}`;
    const coords = await geocodeAddress(fullAddress);
    if (coords) {
      data.latitude = coords.lat;
      data.longitude = coords.lng;
    }
  } else {
    // Retain existing coordinates if geocoding is skipped
    data.latitude = currentProperty.latitude;
    data.longitude = currentProperty.longitude;
  }

  const updatedProperty = await Property.updateProperty(
    propertyId,
    landlordId,
    data
  );

  if (!updatedProperty) {
    throw new Error("Unauthorized or property not found");
  }

  // 2️⃣ Parallelize Image and Amenity Updates
  const tasks = [];

  if (data.images) {
    tasks.push((async () => {
      await Images.deleteImagesByProperty(propertyId);
      const imagePromises = data.images.map(img => {
        const url = img.url || img.image_url;
        return url ? Images.addImage(propertyId, url, img.is_cover) : null;
      }).filter(p => p !== null);
      await Promise.all(imagePromises);
    })());
  }

  if (data.amenities) {
    tasks.push((async () => {
      await Amenities.removeAmenitiesFromProperty(propertyId);
      const amenityPromises = data.amenities.map(amenityId => 
        Amenities.addAmenityToProperty(propertyId, amenityId)
      );
      await Promise.all(amenityPromises);
    })());
  }

  if (tasks.length > 0) {
    await Promise.all(tasks);
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

