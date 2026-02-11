const ProviderModel = require("../models/ServiceProviderModel");
const sendServiceAcceptanceMail = require("../utils/sendServiceAcceptanceMail");
const sendServiceRejectionMail = require("../utils/sendServiceRejectionMail");
const sendServiceCompletionMail = require("../utils/sendServiceCompletionMail");

exports.getProfile = async (req, res) => {
    try {
        const profile = await ProviderModel.getProfile(req.user.id);
        if (!profile) return res.status(404).json({ error: "Provider profile not found" });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const profile = await ProviderModel.updateProfile(req.user.id, req.body);
        if (!profile) return res.status(404).json({ error: "Provider profile not found" });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReviews = async (req, res) => {
    try {
        const providerId = await ProviderModel.getProviderId(req.user.id);
        if (!providerId) return res.status(404).json({ error: "Provider profile not found" });

        const reviews = await ProviderModel.getReviews(providerId);
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOverview = async (req, res) => {
    try {
        const providerId = await ProviderModel.getProviderId(req.user.id);
        if (!providerId) return res.status(404).json({ error: "Provider profile not found" });

        const stats = await ProviderModel.getStats(providerId);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getServices = async (req, res) => {
    try {
        const providerId = await ProviderModel.getProviderId(req.user.id);
        const services = await ProviderModel.getServices(providerId);
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addService = async (req, res) => {
    try {
        const providerId = await ProviderModel.getProviderId(req.user.id);
        if (!providerId) return res.status(404).json({ error: "Provider profile not found" });

        const imageUrl = req.file ? req.file.path : null;

        // If service_id is provided, it's from catalog (backward compatibility or hybrid)
        // If not, it's a manual creation
        if (req.body.service_id) {
            const service = await ProviderModel.addService(providerId, {
                ...req.body,
                image_url: imageUrl || req.body.image_url
            });
            return res.status(201).json(service);
        }

        // Manual Creation
        const service = await ProviderModel.createAndAddService(providerId, {
            ...req.body,
            image_url: imageUrl,
            features: typeof req.body.features === 'string' ? JSON.parse(req.body.features) : req.body.features
        });

        res.status(201).json(service);
    } catch (err) {
        console.error("Add Service Error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateService = async (req, res) => {
    try {
        const providerId = await ProviderModel.getProviderId(req.user.id);
        // Use Cloudinary URL if uploaded, otherwise use the URL passed in body (for predefined services)
        const imageUrl = req.file ? req.file.path : req.body.image_url || req.body.image || undefined;

        const service = await ProviderModel.updateService(req.params.id, providerId, {
            ...req.body,
            image_url: imageUrl
        });
        res.json(service);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const providerId = await ProviderModel.getProviderId(req.user.id);
        await ProviderModel.deleteService(req.params.id, providerId);
        res.json({ message: "Service deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.toggleService = async (req, res) => {
    try {
        const providerId = await ProviderModel.getProviderId(req.user.id);
        const service = await ProviderModel.toggleService(req.params.id, providerId);
        res.json(service);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- CATALOG CONTROLLERS ---

exports.getCategories = async (req, res) => {
    try {
        const providerId = await ProviderModel.getProviderId(req.user.id);
        const categories = await ProviderModel.getCategories(providerId);
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTypes = async (req, res) => {
    try {
        const types = await ProviderModel.getTypes(req.params.categoryId);
        res.json(types);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCatalogServices = async (req, res) => {
    try {
        const providerId = await ProviderModel.getProviderId(req.user.id);
        const services = await ProviderModel.getCatalogServices(req.params.typeId, providerId);
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getServicesByCategory = async (req, res) => {
    try {
        const services = await ProviderModel.getServicesByCategory(req.params.categoryId);
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addCategory = async (req, res) => {
    try {
        const providerId = await ProviderModel.getProviderId(req.user.id);
        const imageUrl = req.file ? req.file.path : req.body.image_url;
        const category = await ProviderModel.addCategory({ ...req.body, image_url: imageUrl, provider_id: providerId });
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const imageUrl = req.file ? req.file.path : req.body.image_url;
        const category = await ProviderModel.updateCategory(req.params.id, { ...req.body, image_url: imageUrl });
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await ProviderModel.deleteCategory(req.params.id);
        res.json({ message: "Category deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addType = async (req, res) => {
    try {
        const imageUrl = req.file ? req.file.path : req.body.image_url;
        const type = await ProviderModel.addType({ ...req.body, image_url: imageUrl });
        res.status(201).json(type);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateType = async (req, res) => {
    try {
        const imageUrl = req.file ? req.file.path : req.body.image_url;
        const type = await ProviderModel.updateType(req.params.id, { ...req.body, image_url: imageUrl });
        res.json(type);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteType = async (req, res) => {
    try {
        await ProviderModel.deleteType(req.params.id);
        res.json({ message: "Type deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addCatalogService = async (req, res) => {
    try {
        const imageUrl = req.file ? req.file.path : req.body.image_url;
        const service = await ProviderModel.addCatalogService({
            ...req.body,
            image_url: imageUrl,
            features: typeof req.body.features === 'string' ? JSON.parse(req.body.features) : req.body.features
        });
        res.status(201).json(service);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const providerId = await ProviderModel.getProviderId(req.user.id);
        if (!providerId) return res.status(404).json({ error: "Provider profile not found" });

        const bookings = await ProviderModel.getBookings(providerId);
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const providerId = await ProviderModel.getProviderId(req.user.id);
        const { status, rejection_reason } = req.body;
        console.log(`DEBUG: Updating booking ${req.params.id} for provider ${providerId} to status ${status}`);
        const booking = await ProviderModel.updateBookingStatus(req.params.id, providerId, status, rejection_reason);
        if (!booking) {
            console.warn(`DEBUG: Booking ${req.params.id} not found or doesn't belong to provider ${providerId}`);
            return res.status(404).json({ error: "Booking not found" });
        }

        // Get details for email
        const details = await ProviderModel.getBookingDetails(req.params.id);
        if (!details) return res.json(booking);

        // Send Email if Accepted (Asynchronously)
        if (status === 'Accepted' || status === 'Confirmed') {
            sendServiceAcceptanceMail(
                details.email,
                details.user_name || details.tenant_name,
                details.service_name,
                details.provider_name,
                details.provider_phone,
                details.booking_date,
                details.booking_time,
                details.address,
                details.amount,
                details.payment_method
            ).catch(err => console.error("Async Acceptance email failed:", err));
        }

        // Send Email if Rejected (Asynchronously)
        if (status === 'Rejected') {
            sendServiceRejectionMail(
                details.email,
                details.user_name || details.tenant_name,
                details.service_name,
                details.provider_name,
                rejection_reason
            ).catch(err => console.error("Async Rejection email failed:", err));
        }

        // Send Email if Completed (Asynchronously)
        if (status === 'Completed') {
            sendServiceCompletionMail(
                details.email,
                details.user_name || details.tenant_name,
                details.service_name,
                details.provider_name,
                details.amount,
                details.payment_method
            ).catch(err => console.error("Async Completion email failed:", err));
        }

        res.json(booking);
    } catch (err) {
        console.error("Update Booking Status Error:", err);
        res.status(500).json({ error: err.message });
    }
};
