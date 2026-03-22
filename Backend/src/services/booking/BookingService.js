const BookingModel = require('../../models/booking/BookingModel');
const ServiceRequestModel = require('../../models/serviceProvider/ServiceRequestModel');
const TenantModel = require('../../models/tenant/TenantModel');
const sendServiceRequestNotification = require("../../utils/email/sendServiceRequestNotification");
const NotificationService = require("../common/NotificationService");
const PropertyModel = require('../../models/landlord/PropertyModel');
const UserModel = require('../../models/common/UserModel');
const sendBookingStatusNotification = require("../../utils/email/sendBookingStatusNotification");

class BookingService {
    // --- Property Visit Bookings ---
    async createPropertyBooking(userId, propertyId, message, visitSlot) {
        // 1. Check if property exists
        const property = await PropertyModel.getPropertyById(propertyId);
        if (!property) throw new Error("Property not found");


        // 2. Check for existing pending/approved bookings
        const existing = await BookingModel.checkExistingBooking(userId, propertyId);
        if (existing) throw new Error("You already have a pending/approved request for this property.");

        return await BookingModel.createBooking(userId, propertyId, message, visitSlot);
    }

    async getMyPropertyBookings(userId) {
        return await BookingModel.getBookingsByUser(userId);
    }

    async getPropertyBookings(propertyId) {
        return await BookingModel.getBookingsByProperty(propertyId);
    }

    async getLandlordBookings(landlordId) {
        return await BookingModel.getBookingsByLandlord(landlordId);
    }

    async updatePropertyBookingStatus(bookingId, status, visitSlot) {
        const booking = await BookingModel.updateStatus(bookingId, status, visitSlot);

        // Fire-and-forget email notification
        this._handleBookingStatusNotification(booking, status, visitSlot)
            .catch(err => console.error("Async booking email failed:", err));

        return booking;
    }

    async _handleBookingStatusNotification(booking, status, visitSlot) {
        if (!booking || (status !== 'Approved' && status !== 'Rejected')) return;

        try {
            const property = await PropertyModel.getPropertyById(booking.property_id);
            const tenant = await UserModel.findUserById(booking.user_id);

            if (property && tenant) {
                await sendBookingStatusNotification(tenant.email, {
                    tenantName: `${tenant.first_name} ${tenant.last_name}`,
                    propertyName: property.title,
                    propertyAddress: `${property.address}, ${property.locality}, ${property.city}`,
                    status: status,
                    visitSlot: visitSlot,
                    landlordName: `${property.first_name} ${property.last_name}`
                });
            }
        } catch (err) {
            console.error("Failed to send booking status email:", err);
        }
    }

    // --- Home Service Bookings (Service Requests) ---
    async createServiceRequest(userId, data) {
        const tenant = await TenantModel.getByUserId(userId);

        const request = await ServiceRequestModel.create({
            ...data,
            user_id: userId,
            tenant_id: tenant ? tenant.id : null
        });

        // Trigger Async Notification
        this._handleServiceRequestNotification(request).catch(err => console.error("Service request notification failed:", err));

        return request;
    }

    async getMyServiceRequests(userId) {
        return await ServiceRequestModel.getByUser(userId);
    }

    async updateServiceReview(requestId, userId, comment, rating) {
        const result = await ServiceRequestModel.updateReview(requestId, userId, comment, rating);
        if (!result) throw new Error("Request not found or access denied");
        return result;
    }

    /**
     * Private helper for service request notifications
     */
    async _handleServiceRequestNotification(request) {
        // 1. Email Notification
        await sendServiceRequestNotification(request);

        // 2. Internal Notification for Provider
        if (request.assigned_provider_id) {
            const ProviderModel = require("../../models/serviceProvider/ServiceProviderModel");
            const provider = await ProviderModel.getProviderById(request.assigned_provider_id);
            if (provider && provider.user_id) {
                await NotificationService.createNotification(
                    provider.user_id,
                    'booking',
                    "New Service Request",
                    `You have a new booking request for ${request.service_type || 'service'}.`
                );
            }
        }
    }
}

module.exports = new BookingService();
