const router = require("express").Router();
const ctrl = require("../controllers/admin.controller");
const auth = require("../middlewares/AuthMiddleware");
const role = require("../middlewares/RoleMiddleware");

// 🔐 Protect ALL admin routes
router.use(auth);
router.use(role("ADMIN"));

// ---- Admin Dashboard Routes ----

router.get("/overview", ctrl.overview);

// User Management
router.get("/users", ctrl.getUsers);
router.put("/users/:id/status", ctrl.toggleUserStatus);

// Property Monitoring
router.get("/properties", ctrl.getProperties);
router.put("/properties/:id/status", ctrl.togglePropertyStatus);

// Complaint Management
router.get("/complaints", ctrl.getComplaints);
router.put("/complaints/:id/resolve", ctrl.resolveComplaint);
router.post("/complaints/:id/convert", ctrl.convertComplaint);

// Service Provider Management
router.get("/providers", ctrl.getProviders);
router.post("/providers", ctrl.addProvider);
router.put("/providers/:id/status", ctrl.toggleProviderStatus);

// Payments & Logs
router.get("/payments", ctrl.getPayments);
router.get("/logs", ctrl.getLogs);

module.exports = router;
