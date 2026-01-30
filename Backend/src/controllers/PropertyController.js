const PropertyService = require("../services/PropertyService");

exports.createProperty = async (req, res) => {
  try {
    console.log("createProperty Request Body:", req.body);
    console.log("createProperty User ID:", req.user.id);
    const property = await PropertyService.createProperty(
      req.user.id,
      req.body
    );
    res.status(201).json(property);
  } catch (err) {
    console.error("createProperty Error:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await PropertyService.getAllProperties();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLandlordProperties = async (req, res) => {
  try {
    const properties = await PropertyService.getPropertiesByLandlord(req.user.id);
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPropertyDetails = async (req, res) => {
  try {
    const property = await PropertyService.getPropertyDetails(req.params.id);
    res.json(property);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};



exports.updateProperty = async (req, res) => {
  try {
    console.log("updateProperty Request:", {
      paramId: req.params.id,
      userId: req.user.id,
      body: req.body
    });

    const updatedProperty = await PropertyService.updateProperty(
      req.params.id,
      req.user.id,
      req.body
    );

    res.json(updatedProperty);
  } catch (err) {
    console.error("updateProperty Error:", err);
    res.status(403).json({ error: err.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    await PropertyService.deleteProperty(
      req.params.id,
      req.user.id
    );

    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};


