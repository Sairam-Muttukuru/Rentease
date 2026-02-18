const router = require("express").Router();
const controller = require("../../controllers/booking/BookingController");
const auth = require("../../middlewares/AuthMiddleware");
const role = require("../../middlewares/RoleMiddleware");

// Tenant
router.post("/", auth, controller.createBooking); // Request booking
router.get("/my", auth, controller.getMyBookings); // View my requests
router.get("/landlord", auth, role("LANDLORD"), controller.getLandlordBookings); // View all requests for landlord's properties

// Landlord
router.get("/property/:propertyId", auth, role("LANDLORD"), controller.getPropertyBookings);
router.patch("/:id/status", auth, role("LANDLORD"), controller.updateBookingStatus);

module.exports = router;
