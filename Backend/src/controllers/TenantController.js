const TenantService = require("../services/TenantService");

exports.addTenant = async (req, res) => {
  try {
    const landlordId = req.user.id;
    const propertyId = req.params.propertyId;

    const tenant = await TenantService.addTenant(
      landlordId,
      propertyId,
      req.body
    );

    res.status(201).json(tenant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTenant = async (req, res) => {
  try {
    const tenant = await TenantService.updateTenant(
      req.user.id,
      req.params.tenantId,
      req.body
    );
    res.json(tenant);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

exports.deleteTenant = async (req, res) => {
  try {
    await TenantService.deleteTenant(req.user.id, req.params.tenantId);
    res.json({ message: "Tenant deleted successfully" });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

exports.getTenantByProperty = async (req, res) => {
  try {
    const tenant = await TenantService.getTenantByProperty(
      req.user.id,
      req.params.propertyId
    );
    res.json(tenant);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await TenantService.getAllTenants(req.user.id);
    res.json(tenants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const data = await TenantService.getDashboardData(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await TenantService.getPayments(req.user.id);
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    // Stub: Return empty array for now as Complaint model doesn't exist
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const result = await TenantService.updateTenantProfile(req.user.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
