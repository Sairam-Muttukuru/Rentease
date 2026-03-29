const ProviderModel = require("../../models/serviceProvider/ServiceProviderModel");
const sendServiceAcceptanceMail = require("../../utils/email/sendServiceAcceptanceMail");
const sendServiceRejectionMail = require("../../utils/email/sendServiceRejectionMail");
const sendServiceCompletionMail = require("../../utils/email/sendServiceCompletionMail");

class ServiceProviderService {
    async getProfile(userId) {
        const profile = await ProviderModel.getProfile(userId);
        if (!profile) throw new Error("Provider profile not found");
        return profile;
    }

    async updateProfile(userId, data) {
        const profile = await ProviderModel.updateProfile(userId, data);
        if (!profile) throw new Error("Provider profile not found");
        return profile;
    }

    async getStats(userId) {
        const providerId = await ProviderModel.getProviderId(userId);
        if (!providerId) throw new Error("Provider profile not found");
        return await ProviderModel.getStats(providerId);
    }

    async getServices(userId) {
        const providerId = await ProviderModel.getProviderId(userId);
        return await ProviderModel.getServices(providerId);
    }

    async addService(userId, data, file) {
        const providerId = await ProviderModel.getProviderId(userId);
        if (!providerId) throw new Error("Provider profile not found");

        const imageUrl = file ? file.path : null;

        if (data.service_id) {
            return await ProviderModel.addService(providerId, {
                ...data,
                image_url: imageUrl || data.image_url
            });
        }

        return await ProviderModel.createAndAddService(providerId, {
            ...data,
            image_url: imageUrl,
            features: typeof data.features === 'string' ? JSON.parse(data.features) : data.features
        });
    }

    async updateService(serviceId, userId, data, file) {
        const providerId = await ProviderModel.getProviderId(userId);
        const imageUrl = file ? file.path : data.image_url || data.image || undefined;

        return await ProviderModel.updateService(serviceId, providerId, {
            ...data,
            image_url: imageUrl
        });
    }

    async deleteService(serviceId, userId) {
        const providerId = await ProviderModel.getProviderId(userId);
        return await ProviderModel.deleteService(serviceId, providerId);
    }

    async toggleService(serviceId, userId) {
        const providerId = await ProviderModel.getProviderId(userId);
        return await ProviderModel.toggleService(serviceId, providerId);
    }

    async getBookings(userId) {
        const providerId = await ProviderModel.getProviderId(userId);
        if (!providerId) throw new Error("Provider profile not found");
        return await ProviderModel.getBookings(providerId);
    }

    async updateBookingStatus(bookingId, userId, status, rejectionReason) {
        const providerId = await ProviderModel.getProviderId(userId);
        const booking = await ProviderModel.updateBookingStatus(bookingId, providerId, status, rejectionReason);
        if (!booking) throw new Error("Booking not found or access denied");

        // Orchestrate Email Notifications
        console.log(`[DEBUG] updateBookingStatus: Orchestrating emails for booking ${bookingId}, status: ${status}`);
        this._handleBookingStatusEmails(bookingId, status, rejectionReason)
            .then(() => console.log(`[DEBUG] updateBookingStatus: Email orchestration complete for ${bookingId}`))
            .catch(err => console.error(`[ERROR] updateBookingStatus: Email orchestration failed for ${bookingId}:`, err));

        return booking;
    }

    /**
     * Private helper for emails
     */
    async _handleBookingStatusEmails(bookingId, status, rejectionReason) {
        console.log(`[DEBUG] _handleBookingStatusEmails: Fetching details for booking ${bookingId}`);
        const details = await ProviderModel.getBookingDetails(bookingId);
        if (!details) {
            console.error(`[ERROR] _handleBookingStatusEmails: No details found for booking ${bookingId}`);
            return;
        }

        const { email, user_name, tenant_name, service_name, provider_name, provider_phone, booking_date, booking_time, address, amount, payment_method } = details;
        const recipientName = user_name || tenant_name;
        
        console.log(`[DEBUG] _handleBookingStatusEmails: Found details. Recipient: ${email}, Status: ${status}`);

        const upperStatus = status ? status.toUpperCase() : '';

        if (upperStatus === 'ACCEPTED' || upperStatus === 'CONFIRMED') {
            console.log(`[DEBUG] _handleBookingStatusEmails: Sending Acceptance Mail to ${email}`);
            await sendServiceAcceptanceMail(email, recipientName, service_name, provider_name, provider_phone, booking_date, booking_time, address, amount, payment_method);
        } else if (upperStatus === 'REJECTED') {
            console.log(`[DEBUG] _handleBookingStatusEmails: Sending Rejection Mail to ${email}`);
            await sendServiceRejectionMail(email, recipientName, service_name, provider_name, rejectionReason);
        } else if (upperStatus === 'COMPLETED' || upperStatus === 'FINISHED') {
            console.log(`[DEBUG] _handleBookingStatusEmails: Sending Completion Mail to ${email}`);
            await sendServiceCompletionMail(email, recipientName, service_name, provider_name, amount, payment_method);
        } else {
            console.log(`[DEBUG] _handleBookingStatusEmails: Status ${upperStatus} does not trigger any email.`);
        }
    }

    // Catalog methods
    async getCategories(userId) {
        const providerId = await ProviderModel.getProviderId(userId);
        return await ProviderModel.getCategories(providerId);
    }

    async getTypes(categoryId) {
        return await ProviderModel.getTypes(categoryId);
    }

    async getSubTypes(typeId) {
        return await ProviderModel.getSubTypes(typeId);
    }

    async getCatalogServices(typeId, userId) {
        const providerId = await ProviderModel.getProviderId(userId);
        return await ProviderModel.getCatalogServices(typeId, providerId);
    }

    async getCatalogServicesBySubType(subTypeId, userId) {
        const providerId = await ProviderModel.getProviderId(userId);
        return await ProviderModel.getCatalogServicesBySubType(subTypeId, providerId);
    }
}

module.exports = new ServiceProviderService();
