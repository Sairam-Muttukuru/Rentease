const Amenity = require("../../models/landlord/AmenityModel");

exports.getAllAmenities = async (landlordId) => {
  return await Amenity.getAllAmenities(landlordId);
};

exports.addCustomAmenity = async (name, landlordId) => {
  if (!name || name.trim() === "") {
    throw new Error("Amenity name is required");
  }
  return await Amenity.addCustomAmenity(name.trim(), landlordId);
};
