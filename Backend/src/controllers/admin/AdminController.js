const service = require("../../services/admin/AdminService");

exports.overview = async (req, res) =>
  res.json(await service.getOverview());

exports.getUsers = async (req, res) =>
  res.json(await service.getUsers(req.user.id));

exports.toggleUserStatus = async (req, res) =>
  res.json(await service.toggleUserStatus(req.params.id, req.user.id));

exports.getProperties = async (req, res) =>
  res.json(await service.getProperties());

exports.togglePropertyStatus = async (req, res) =>
  res.json(await service.togglePropertyStatus(req.params.id, req.user.id));

exports.getComplaints = async (req, res) =>
  res.json(await service.getComplaints());

exports.resolveComplaint = async (req, res) =>
  res.json(await service.resolveComplaint(req.params.id, req.user.id));

exports.convertComplaint = async (req, res) =>
  res.json(await service.convertComplaint(req.params.id, req.body.priority, req.user.id));

exports.getProviders = async (req, res) =>
  res.json(await service.getProviders());

exports.addProvider = async (req, res) => {
  try {
    console.log("📝 Received provider registration request:", req.body);
    const result = await service.addProvider(req.body, req.user.id);
    console.log("✅ Provider added successfully:", result);
    res.json(result);
  } catch (err) {
    console.error("❌ Error adding provider:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      requestBody: req.body
    });

    if (err.message.includes("already exists")) {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({
      error: "Failed to add provider",
      details: err.message
    });
  }
};

exports.deleteProvider = async (req, res) => {
  try {
    const { reason } = req.body || req.headers.reason; // Handle reason in body or headers
    const actualReason = reason || req.query.reason;
    if (!actualReason) {
        return res.status(400).json({ error: "Reason is required for deletion." });
    }
    const result = await service.deleteProvider(req.params.id, actualReason, req.user.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleProviderStatus = async (req, res) =>
  res.json(await service.toggleProviderStatus(req.params.id, req.user.id));

exports.getPayments = async (req, res) =>
  res.json(await service.getPayments());

exports.getLogs = async (req, res) =>
  res.json(await service.getLogs());

exports.getServiceTracker = async (req, res) =>
  res.json(await service.getServiceTracker());
