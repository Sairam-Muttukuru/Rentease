const ProviderModel = require("../../models/serviceProvider/ServiceProviderModel");
const sendServiceAcceptanceMail = require("../../utils/email/sendServiceAcceptanceMail");
const sendServiceRejectionMail = require("../../utils/email/sendServiceRejectionMail");
const sendServiceCompletionMail = require("../../utils/email/sendServiceCompletionMail");
const AuditService = require("../common/AuditService");

class ServiceProviderService {
    async getProfile(userId) {
        const profile = await ProviderModel.getProfile(userId);
        if (!profile) throw new Error("Provider profile not found");
        return profile;
    }

    async updateProfile(userId, data) {
        const profile = await ProviderModel.updateProfile(userId, data);
        if (!profile) throw new Error("Provider profile not found");
        await AuditService.logUserAction(userId, userId, "Updated Provider Profile", `Company: ${profile.company_name}`);
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

        const result = data.service_id
            ? await ProviderModel.addService(providerId, {
                ...data,
                image_url: imageUrl || data.image_url
            })
            : await ProviderModel.createAndAddService(providerId, {
                ...data,
                image_url: imageUrl || data.image_url,
                features: typeof data.features === 'string' ? JSON.parse(data.features) : data.features
            });

        await AuditService.logServiceAction(userId, result.id || "N/A", "Listed Service", `Name: ${data.name || data.service_name}`);
        return result;
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
        await AuditService.logServiceAction(userId, serviceId, "Deleted Service");
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

        await AuditService.logServiceAction(userId, bookingId, "Updated Booking Status", `New Status: ${status}`);

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
        try {
            console.log(`[DEBUG] _handleBookingStatusEmails: Process started for booking ${bookingId}, status: ${status}`);
            
            const details = await ProviderModel.getBookingDetails(bookingId);
            if (!details) {
                console.error(`[ERROR] _handleBookingStatusEmails: No details found for booking ${bookingId}. The JOIN might be failing.`);
                return;
            }

            console.log(`[DEBUG] _handleBookingStatusEmails: Successfully fetched details for booking ${bookingId}:`, {
                recipient: details.email,
                customer: details.user_name || details.tenant_name,
                service: details.service_name,
                provider: details.provider_name || 'N/A',
                provider_phone: details.provider_phone || 'N/A'
            });

            const { 
                email, 
                user_name, 
                tenant_name, 
                service_name, 
                provider_name, 
                provider_phone, 
                booking_date, 
                booking_time, 
                address, 
                amount, 
                payment_method 
            } = details;

            if (!email) {
                console.warn(`[WARNING] _handleBookingStatusEmails: Skipping email for booking ${bookingId} - No recipient email found.`);
                return;
            }

            const recipientName = user_name || tenant_name || 'Valued Customer';
            const upperStatus = status ? status.trim().toUpperCase() : '';

            console.log(`[DEBUG] _handleBookingStatusEmails: Normalized status: "${upperStatus}"`);

            if (upperStatus === 'ACCEPTED' || upperStatus === 'CONFIRMED' || upperStatus === 'ASSIGNED') {
                console.log(`[DEBUG] _handleBookingStatusEmails: Triggering Acceptance/Confirmation Mail to ${email}`);
                await sendServiceAcceptanceMail(email, recipientName, service_name, provider_name, provider_phone, booking_date, booking_time, address, amount, payment_method);
            } else if (upperStatus === 'REJECTED' || upperStatus === 'CANCELLED') {
                console.log(`[DEBUG] _handleBookingStatusEmails: Triggering Rejection/Cancellation Mail to ${email}`);
                await sendServiceRejectionMail(email, recipientName, service_name, provider_name, rejectionReason);
            } else if (upperStatus === 'COMPLETED' || upperStatus === 'FINISHED' || upperStatus === 'CLOSED') {
                console.log(`[DEBUG] _handleBookingStatusEmails: Triggering Completion Mail to ${email}`);
                await sendServiceCompletionMail(email, recipientName, service_name, provider_name, amount, payment_method);
            } else {
                console.log(`[DEBUG] _handleBookingStatusEmails: Status "${upperStatus}" did not match any triggers (ACCEPTED, REJECTED, CANCELLED, COMPLETED, etc.). Current: "${upperStatus}"`);
            }
        } catch (error) {
            console.error(`[CRITICAL ERROR] _handleBookingStatusEmails failed for booking ${bookingId}:`, error);
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

    async getReceipt(bookingId, userId, res) {
        const providerId = await ProviderModel.getProviderId(userId);
        const booking = await ProviderModel.getBookingForReceipt(bookingId, providerId);
        
        if (!booking) {
            throw new Error("Booking not found or access denied");
        }

        const generateServiceReceipt = require('../../utils/helpers/generateServiceReceipt');
        await generateServiceReceipt(res, booking);
    }
}

module.exports = new ServiceProviderService();
