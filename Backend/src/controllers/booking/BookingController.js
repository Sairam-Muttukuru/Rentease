const BookingService = require('../../services/booking/BookingService');
const AuditService = require('../../services/common/AuditService');

exports.createBooking = async (req, res) => {
    try {
        const { propertyId, message, visitSlot } = req.body;
        const booking = await BookingService.createPropertyBooking(req.user.id, propertyId, message, visitSlot);
        await AuditService.logBookingAction(req.user.id, booking.id, "Requested Visit", `Property ID: ${propertyId}`);
        res.status(201).json(booking);
    } catch (err) {
        console.error("Create Booking Error:", err);
        res.status(err.message.includes("already have") ? 400 : 500).json({ error: err.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await BookingService.getMyPropertyBookings(req.user.id);
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPropertyBookings = async (req, res) => {
    try {
        const bookings = await BookingService.getPropertyBookings(req.params.propertyId);
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getLandlordBookings = async (req, res) => {
    try {
        const bookings = await BookingService.getLandlordBookings(req.user.id);
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status, visitSlot } = req.body;
        const booking = await BookingService.updatePropertyBookingStatus(req.params.id, status, visitSlot || null);
        await AuditService.logBookingAction(req.user.id, req.params.id, "Updated Status", `New Status: ${status}`);
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
