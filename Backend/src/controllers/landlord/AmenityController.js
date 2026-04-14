const AmenityService = require("../../services/landlord/AmenityService");

exports.getAmenities = async (req, res) => {
  try {
    const amenities = await AmenityService.getAllAmenities(req.user.id);
    res.json(amenities);
  } catch (err) {
    console.error("getAmenities Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.addCustomAmenity = async (req, res) => {
  try {
    const { name } = req.body;
    const newAmenity = await AmenityService.addCustomAmenity(name, req.user.id);
    res.status(201).json(newAmenity);
  } catch (err) {
    console.error("addCustomAmenity Error:", err);
    res.status(400).json({ error: err.message });
  }
};
