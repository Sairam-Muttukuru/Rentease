const express = require("express");
const router = express.Router();
const controller = require("../controllers/ServiceProviderController");
const { upload } = require("../config/cloudinary");
const protect = require("../middlewares/AuthMiddleware");
const role = require("../middlewares/RoleMiddleware");

// All routes are protected and restricted to SERVICE_PROVIDER role
router.use(protect);
router.use(role("SERVICE_PROVIDER"));

router.get("/overview", controller.getOverview);
router.get("/profile", controller.getProfile);
router.put("/profile", controller.updateProfile);
router.get("/reviews", controller.getReviews);
router.get("/services", controller.getServices);
router.post("/services", controller.addService);
router.put("/services/:id", controller.updateService);
router.delete("/services/:id", controller.deleteService);
router.patch("/services/:id/toggle", controller.toggleService);
router.get("/bookings", controller.getBookings);
router.patch("/bookings/:id/status", controller.updateBookingStatus);

// Catalog Routes
router.get("/catalog/categories", controller.getCategories);
router.get("/catalog/types/:categoryId", controller.getTypes);
router.get("/catalog/services/:typeId", controller.getCatalogServices);

router.post("/catalog/category", controller.addCategory);
router.put("/catalog/category/:id", controller.updateCategory);
router.delete("/catalog/category/:id", controller.deleteCategory);
router.post("/catalog/type", controller.addType);
router.put("/catalog/type/:id", controller.updateType);
router.delete("/catalog/type/:id", controller.deleteType);
router.post("/catalog/service", controller.addCatalogService);

module.exports = router;
