const TenantService = require("../services/TenantService");
const ProviderModel = require("../models/ServiceProviderModel");
const ServiceRequestModel = require("../models/ServiceRequestModel");
const TenantModel = require("../models/TenantModel");
const sendServiceRequestNotification = require("../utils/sendServiceRequestNotification");
const db = require("../config/db");

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
    const complaints = await TenantService.getComplaints(req.user.id);
    res.json(complaints);
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

// --- Catalog Methods ---
exports.getCategories = async (req, res) => {
  try {
    // Pass null to get only system categories or all (logic in model handles null providerId)
    const categories = await ProviderModel.getCategories(null);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTypes = async (req, res) => {
  try {
    const types = await ProviderModel.getTypes(req.params.categoryId);
    res.json(types);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCatalogServices = async (req, res) => {
  try {
    // Get all services for a type, regardless of provider (hence null)
    const services = await ProviderModel.getCatalogServices(req.params.typeId, null);
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getServicesByCategory = async (req, res) => {
  try {
    const services = await ProviderModel.getServicesByCategory(req.params.categoryId);
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createServiceRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    // Try to get tenant ID if exists, but not strictly required for all users
    const tenant = await TenantModel.getByUserId(userId);

    const request = await ServiceRequestModel.create({
      ...req.body,
      user_id: userId,
      tenant_id: tenant?.id || null
    });

    // --- Send Email Notification to Provider ---
    try {
      const { service_id, provider_id, scheduled_date, scheduled_time, address, contact_number, property_image } = req.body;

      // 1. Get Provider Email & Name
      const providerRes = await db.query(
        `SELECT u.email, sp.company_name 
             FROM service_providers sp 
             JOIN users u ON sp.user_id = u.id 
             WHERE sp.id = $1`,
        [provider_id]
      );
      const provider = providerRes.rows[0];

      // 2. Get Service Name
      const serviceRes = await db.query("SELECT name FROM services WHERE id = $1", [service_id]);
      const serviceParams = serviceRes.rows[0];

      // 3. Get User Name
      const userRes = await db.query("SELECT first_name, last_name FROM users WHERE id = $1", [userId]);
      const userParams = userRes.rows[0];

      if (provider) {
        // Send email asynchronously (fire-and-forget) to prevent blocking response
        sendServiceRequestNotification(provider.email, {
          serviceName: serviceParams?.name || 'Service',
          providerName: provider.company_name,
          tenantName: `${userParams.first_name} ${userParams.last_name}`,
          contactNumber: contact_number,
          address: address,
          scheduledDate: scheduled_date || req.body.booking_date,
          scheduledTime: scheduled_time || req.body.booking_time,
          propertyImage: property_image // Passed from frontend
        }).catch(err => console.error("Background Email Error:", err));
      }
    } catch (emailErr) {
      console.error("Failed to send provider notification email:", emailErr);
      // Don't block the response, just log the error
    }

    res.status(201).json(request);
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.getServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequestModel.getByUser(req.user.id);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateServiceRequestComment = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    console.log(`[Controller] Updating review for Request ${req.params.id} by User ${req.user.id}`);
    const request = await ServiceRequestModel.updateReview(req.params.id, req.user.id, comment, rating);
    if (!request) return res.status(404).json({ error: "Service request not found or unauthorized" });
    res.json(request);
  } catch (err) {
    console.error(`[Controller] Error updating review:`, err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};
