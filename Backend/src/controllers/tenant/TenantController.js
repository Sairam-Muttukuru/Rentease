const TenantService = require("../../services/tenant/TenantService");
const ServiceProviderService = require("../../services/serviceProvider/ServiceProviderService");
const BookingService = require("../../services/booking/BookingService");
const logger = require("../../utils/logger");

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
    console.error(`[TenantController] Error adding tenant:`, err);
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
    const { userName } = req.query;
    const data = await TenantService.getDashboardData(req.user.id, userName);
    res.json(data);
  } catch (err) {
    logger(err, `getDashboardData(userId=${req.user?.id}, userName=${req.query.userName})`);
    res.status(404).json({ error: err.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const { userName } = req.query;
    const payments = await TenantService.getPayments(req.user.id, userName);
    res.json(payments);
  } catch (err) {
    logger(err, `getPayments(userId=${req.user?.id}, userName=${req.query.userName})`);
    res.status(500).json({ error: err.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const { userName } = req.query;
    const complaints = await TenantService.getComplaints(req.user.id, userName);
    res.json(complaints);
  } catch (err) {
    logger(err, `getComplaints(userId=${req.user?.id}, userName=${req.query.userName})`);
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

// --- Catalog Methods (Delegated to ServiceProviderService) ---
exports.getCategories = async (req, res) => {
  try {
    const categories = await ServiceProviderService.getCategories(null);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTypes = async (req, res) => {
  try {
    const types = await ServiceProviderService.getTypes(req.params.categoryId);
    res.json(types);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCatalogServices = async (req, res) => {
  try {
    const services = await ServiceProviderService.getCatalogServices(req.params.typeId, null);
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getServicesByCategory = async (req, res) => {
  try {
    const ProviderModel = require("../../models/serviceProvider/ServiceProviderModel");
    const services = await ProviderModel.getServicesByCategory(req.params.categoryId);
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubTypes = async (req, res) => {
  try {
    const subTypes = await ServiceProviderService.getSubTypes(req.params.typeId);
    res.json(subTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getServicesBySubType = async (req, res) => {
  try {
    const services = await ServiceProviderService.getCatalogServicesBySubType(req.params.subTypeId, null);
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createServiceRequest = async (req, res) => {
  try {
    const request = await BookingService.createServiceRequest(req.user.id, req.body);
    res.status(201).json(request);
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.getServiceRequests = async (req, res) => {
  try {
    const requests = await BookingService.getMyServiceRequests(req.user.id);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateServiceRequestComment = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const request = await BookingService.updateServiceReview(req.params.id, req.user.id, comment, rating);
    res.json(request);
  } catch (err) {
    console.error(`[Controller] Error updating review:`, err);
    res.status(err.message === "Request not found or access denied" ? 404 : 500).json({ error: err.message });
  }
};
