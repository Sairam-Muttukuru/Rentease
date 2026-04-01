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

        const booking = await BookingModel.createBooking(userId, propertyId, message, visitSlot);

        // 3. Notify Landlord (Async)
        this._handleLandlordBookingNotification(booking, property, userId, message, visitSlot)
            .catch(err => console.error("Async landlord booking notification failed:", err));

        return booking;
    }

    async _handleLandlordBookingNotification(booking, property, userId, message, visitSlot) {
        try {
            const tenant = await UserModel.findUserById(userId);
            const landlord = await UserModel.findUserById(property.landlord_id);

            if (landlord && landlord.email) {
                // Internal Dashboard Notification
                await NotificationService.createNotification(
                    property.landlord_id,
                    'booking',
                    "📅 New Booking Request",
                    `${tenant.first_name || 'A tenant'} has requested to visit ${property.title}.`
                );

                // Email Notification
                const sendPropertyBookingNotification = require("../../utils/email/sendPropertyBookingNotification");
                await sendPropertyBookingNotification(landlord.email, {
                    landlordName: `${landlord.first_name} ${landlord.last_name}`,
                    tenantName: `${tenant.first_name} ${tenant.last_name}`,
                    propertyName: property.title,
                    propertyAddress: `${property.address}, ${property.locality}`,
                    visitSlot: visitSlot,
                    message: message,
                    dashboardUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/landlord/dashboard`
                });
            }
        } catch (err) {
            console.error("Landlord notification orchestration failed:", err);
        }
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
        // Normalize to uppercase for consistent comparison
        const normalizedStatus = status ? status.toUpperCase() : '';
        if (!booking || (normalizedStatus !== 'APPROVED' && normalizedStatus !== 'REJECTED')) return;

        try {
            const property = await PropertyModel.getPropertyById(booking.property_id);
            const tenant = await UserModel.findUserById(booking.user_id);
            const landlord = property ? await UserModel.findUserById(property.landlord_id) : null;

            if (property && tenant) {
                let propertyImage = null;
                if (property.images && property.images.length > 0) {
                    const coverImg = property.images.find(img => img.is_cover);
                    propertyImage = coverImg ? coverImg.url : property.images[0].url;
                }

                await sendBookingStatusNotification(tenant.email, {
                    tenantName: `${tenant.first_name} ${tenant.last_name}`,
                    propertyName: property.title,
                    propertyAddress: `${property.address}, ${property.locality}, ${property.city}`,
                    status: normalizedStatus,
                    visitSlot: visitSlot,
                    propertyImage: propertyImage,
                    landlordName: landlord
                        ? `${landlord.first_name} ${landlord.last_name}`
                        : `${property.first_name || ''} ${property.last_name || ''}`.trim() || 'Landlord'
                });
            }
        } catch (err) {
            console.error("Failed to send booking status email:", err);
        }
    }

    // --- Home Service Bookings (Service Requests) ---
    async createServiceRequest(userId, data) {
        const tenantResult = await TenantModel.getByUserId(userId);
        const tenant = Array.isArray(tenantResult) ? tenantResult[0] : tenantResult;
        const user = await UserModel.findUserById(userId);

        // Auto-fill property and landlord details if it's a tenant
        const enrichedData = {
            ...data,
            user_id: userId,
            tenant_id: tenant ? tenant.id : null,
            property_id: (data.property_id || (tenant ? tenant.property_id : null)),
            landlord_id: (data.landlord_id || (tenant ? tenant.landlord_id : null)),
            customer_email: user ? user.email : null,
            provider_service_id: data.provider_service_id || null // Remove incorrect service_id fallback
        };

        const request = await ServiceRequestModel.create(enrichedData);

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
