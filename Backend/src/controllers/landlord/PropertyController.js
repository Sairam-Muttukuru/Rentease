const PropertyService = require("../../services/landlord/PropertyService");
const AuditService = require("../../services/common/AuditService");


exports.createProperty = async (req, res) => {
  try {
    console.log("createProperty Request Body:", req.body);
    console.log("createProperty User ID:", req.user.id);
    const property = await PropertyService.createProperty(
      req.user.id,
      req.body
    );
    await AuditService.logPropertyAction(req.user.id, property.id, "Created", `Title: ${property.title}`);
    res.status(201).json(property);
  } catch (err) {
    console.error("createProperty Error:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      city: req.query.city,
      locality: req.query.locality,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      propertyType: req.query.type, // Frontend uses 'type', DB 'property_type'
      bedrooms: req.query.bedrooms,
      status: req.query.status,
      amenities: req.query.amenities ? req.query.amenities.split(',').map(Number) : [],
      sortBy: req.query.sortBy,
      limit: parseInt(req.query.limit) || 12,
      offset: parseInt(req.query.offset) || 0
    };

    const properties = await PropertyService.getAllProperties(filters);
    const totalCount = await PropertyService.getPropertiesCount(filters);

    res.json({
      properties,
      totalCount,
      totalPages: Math.ceil(totalCount / filters.limit || 12),
      currentPage: Math.floor(filters.offset / filters.limit) + 1
    });
  } catch (err) {
    console.error("getAllProperties Error:", err);
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

    await AuditService.logPropertyAction(req.user.id, req.params.id, "Updated", `Fields: ${Object.keys(req.body).join(", ")}`);

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

    await AuditService.logPropertyAction(req.user.id, req.params.id, "Deleted");

    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};


