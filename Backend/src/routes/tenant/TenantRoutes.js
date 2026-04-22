const router = require("express").Router();
const auth = require("../../middlewares/AuthMiddleware");
const role = require("../../middlewares/RoleMiddleware");
const controller = require("../../controllers/tenant/TenantController");
const memberController = require("../../controllers/tenant/TenantMemberController");

// routes/TenantRoutes.js
// Route for Tenant Dashboard
router.get("/dashboard", auth, controller.getDashboardData);

router.get("/payments", auth, controller.getPayments);
router.get("/complaints", auth, controller.getComplaints);
router.put("/profile", auth, controller.updateProfile);

router.post("/property/:propertyId", auth, role("LANDLORD"), controller.addTenant);

router.put("/:tenantId", auth, role("LANDLORD"), controller.updateTenant);

router.delete("/:tenantId", auth, role("LANDLORD"), controller.deleteTenant);

router.get("/property/:propertyId", auth, role("LANDLORD"), controller.getTenantByProperty);

router.get("/all", auth, role("LANDLORD"), controller.getAllTenants);

// --- Member Routes nested under /tenants/:id/members ---
router.get("/:tenantId/members", auth, role("LANDLORD"), memberController.getAllMembers);


router.post("/:tenantId/members", auth, role("LANDLORD"), memberController.addMember);

// --- Catalog Routes (Publicly Accessible) ---
router.get("/catalog/categories", controller.getCategories);
router.get("/catalog/types/:categoryId", controller.getTypes);
router.get("/catalog/services/:typeId", controller.getCatalogServices);
router.get("/catalog/category/:categoryId/services", controller.getServicesByCategory);
router.get("/catalog/category/:categoryId/services", controller.getServicesByCategory);
router.get("/catalog/sub-types/:typeId", controller.getSubTypes);
router.get("/catalog/services-by-subtype/:subTypeId", controller.getServicesBySubType);

router.post("/service-request", auth, controller.createServiceRequest);
router.get("/service-requests", auth, controller.getServiceRequests);
router.put("/service-requests/:id/comment", auth, controller.updateServiceRequestComment);
router.post("/service-requests/:id/cancel", auth, controller.cancelServiceRequest);

module.exports = router;
