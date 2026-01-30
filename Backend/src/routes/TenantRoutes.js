const router = require("express").Router();
const auth = require("../middlewares/AuthMiddleware");
const role = require("../middlewares/RoleMiddleware");
const controller = require("../controllers/TenantController");
const memberController = require("../controllers/TenantMemberController");

// routes/TenantRoutes.js
// Route for Tenant Dashboard
router.get("/dashboard",auth,role("TENANT"),controller.getDashboardData);

router.get("/payments", auth, controller.getPayments);
router.get("/complaints", auth, controller.getComplaints);
router.put("/profile", auth, controller.updateProfile);

router.post("/property/:propertyId",auth,role("LANDLORD"),controller.addTenant);

router.put("/:tenantId",auth,role("LANDLORD"),controller.updateTenant);

router.delete("/:tenantId",auth,role("LANDLORD"),controller.deleteTenant);

router.get("/property/:propertyId",auth,role("LANDLORD"),controller.getTenantByProperty);

router.get("/all",auth,role("LANDLORD"),controller.getAllTenants);

// --- Member Routes nested under /tenants/:id/members ---
router.get("/:tenantId/members",auth,role("LANDLORD"),memberController.getAllMembers);

router.post("/:tenantId/members",auth,role("LANDLORD"),memberController.addMember);

module.exports = router;
