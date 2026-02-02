const router = require("express").Router();
const controller = require("../controllers/BookingController");
const auth = require("../middlewares/AuthMiddleware");
const role = require("../middlewares/RoleMiddleware");

// Tenant
router.post("/", auth, controller.createBooking); // Request booking
router.get("/my", auth, controller.getMyBookings); // View my requests

// Landlord
router.get("/property/:propertyId", auth, role("LANDLORD"), controller.getPropertyBookings);
router.put("/:id/status", auth, role("LANDLORD"), controller.updateBookingStatus);

module.exports = router;
