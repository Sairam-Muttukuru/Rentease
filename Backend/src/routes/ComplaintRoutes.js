const express = require("express");
const router = express.Router();

const ComplaintController = require("../controllers/ComplaintController");
const auth = require("../middlewares/AuthMiddleware");
const role = require("../middlewares/RoleMiddleware");

/**
 * =========================
 * TENANT ROUTES
 * =========================
 */

// Tenant creates a complaint
router.post("/",auth,role("TENANT"),ComplaintController.create);

// Tenant views his complaints
router.get("/tenant",auth,role("TENANT"),ComplaintController.getTenantComplaints);

/**
 * =========================
 * LANDLORD ROUTES
 * =========================
 */

// Landlord views all complaints for his properties
router.get("/landlord",auth,role("LANDLORD"),ComplaintController.getLandlordComplaints);

// Landlord updates complaint status
router.patch("/:id/status",auth,role(["LANDLORD", "TENANT"]),ComplaintController.updateStatus);

module.exports = router;
