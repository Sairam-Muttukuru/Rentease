const ServiceProviderService = require("../../services/serviceProvider/ServiceProviderService");
const ProviderModel = require("../../models/serviceProvider/ServiceProviderModel");

exports.getProfile = async (req, res) => {
    try {
        const profile = await ServiceProviderService.getProfile(req.user.id);
        res.json(profile);
    } catch (err) {
        res.status(err.message === "Provider profile not found" ? 404 : 500).json({ error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const profile = await ServiceProviderService.updateProfile(req.user.id, req.body);
        res.json(profile);
    } catch (err) {
        res.status(err.message === "Provider profile not found" ? 404 : 500).json({ error: err.message });
    }
};

exports.getReviews = async (req, res) => {
    // Reviews are still simple enough for model call, but let's stick to service consistency
    try {
        const profile = await ServiceProviderService.getProfile(req.user.id); // Validates provider exists
        const ProviderModel = require("../../models/serviceProvider/ServiceProviderModel");
        const reviews = await ProviderModel.getReviews(profile.id);
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOverview = async (req, res) => {
    try {
        const stats = await ServiceProviderService.getStats(req.user.id);
        res.json(stats);
    } catch (err) {
        res.status(err.message === "Provider profile not found" ? 404 : 500).json({ error: err.message });
    }
};

exports.getServices = async (req, res) => {
    try {
        const services = await ServiceProviderService.getServices(req.user.id);
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addService = async (req, res) => {
    try {
        const service = await ServiceProviderService.addService(req.user.id, req.body, req.file);
        res.status(201).json(service);
    } catch (err) {
        console.error("Add Service Error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateService = async (req, res) => {
    try {
        const service = await ServiceProviderService.updateService(req.params.id, req.user.id, req.body, req.file);
        res.json(service);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteService = async (req, res) => {
    try {
        await ServiceProviderService.deleteService(req.params.id, req.user.id);
        res.json({ message: "Service deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.toggleService = async (req, res) => {
    try {
        const service = await ServiceProviderService.toggleService(req.params.id, req.user.id);
        res.json(service);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- CATALOG CONTROLLERS ---

exports.getCategories = async (req, res) => {
    try {
        const categories = await ServiceProviderService.getCategories(req.user.id);
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTypes = async (req, res) => {
    try {
        const types = await ServiceProviderService.getTypes(req.params.categoryId);
        res.json(types);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCatalogServices = async (req, res) => {
    try {
        const services = await ServiceProviderService.getCatalogServices(req.params.typeId, req.user.id);
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCatalogServicesBySubType = async (req, res) => {
    try {
        const services = await ServiceProviderService.getCatalogServicesBySubType(req.params.subTypeId, req.user.id);
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getServicesByCategory = async (req, res) => {
    try {
        const ProviderModel = require("../../models/serviceProvider/ServiceProviderModel");
        const services = await ProviderModel.getServicesByCategory(req.params.categoryId);
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addCategory = async (req, res) => {
    try {
        const ProviderModel = require("../../models/serviceProvider/ServiceProviderModel");
        const profile = await ServiceProviderService.getProfile(req.user.id);
        const imageUrl = req.file ? req.file.path : req.body.image_url;
        const category = await ProviderModel.addCategory({ ...req.body, image_url: imageUrl, provider_id: profile.id });
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const ProviderModel = require("../../models/serviceProvider/ServiceProviderModel");
        const imageUrl = req.file ? req.file.path : req.body.image_url;
        const category = await ProviderModel.updateCategory(req.params.id, { ...req.body, image_url: imageUrl });
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const ProviderModel = require("../../models/serviceProvider/ServiceProviderModel");
        await ProviderModel.deleteCategory(req.params.id);
        res.json({ message: "Category deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addType = async (req, res) => {
    try {
        const ProviderModel = require("../../models/serviceProvider/ServiceProviderModel");
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

exports.getSubTypes = async (req, res) => {
    try {
        const subTypes = await ServiceProviderService.getSubTypes(req.params.typeId);
        res.json(subTypes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.addSubType = async (req, res) => {
    try {
        console.log("Add SubType Request Body:", req.body);
        console.log("Add SubType Request File:", req.file);

        if (!ProviderModel) {
            console.error("ProviderModel is undefined!");
            throw new Error("Internal Server Error: ProviderModel not loaded");
        }

        const imageUrl = req.file ? req.file.path : req.body.image_url;
        const subType = await ProviderModel.addSubType({ ...req.body, image_url: imageUrl });
        res.status(201).json(subType);
    } catch (err) {
        console.error("Error adding sub-type:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateSubType = async (req, res) => {
    try {
        const imageUrl = req.file ? req.file.path : req.body.image_url;
        const subType = await ProviderModel.updateSubType(req.params.id, { ...req.body, image_url: imageUrl });
        res.json(subType);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteSubType = async (req, res) => {
    try {
        await ProviderModel.deleteSubType(req.params.id);
        res.json({ message: "Sub-Type deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCatalogServicesBySubType = async (req, res) => {
    try {
        const services = await ProviderModel.getCatalogServicesBySubType(req.params.subTypeId);
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addCatalogService = async (req, res) => {
    try {
        const ProviderModel = require("../../models/serviceProvider/ServiceProviderModel");
        const profile = await ServiceProviderService.getProfile(req.user.id);
        const imageUrl = req.file ? req.file.path : req.body.image_url;
        const service = await ProviderModel.addCatalogService({
            ...req.body,
            provider_id: profile.id, // CRITICAL: Link service to provider
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
        const bookings = await ServiceProviderService.getBookings(req.user.id);
        res.json(bookings);
    } catch (err) {
        res.status(err.message === "Provider profile not found" ? 404 : 500).json({ error: err.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status, rejection_reason } = req.body;
        const booking = await ServiceProviderService.updateBookingStatus(req.params.id, req.user.id, status, rejection_reason);
        res.json(booking);
    } catch (err) {
        console.error("Update Booking Status Error:", err);
        res.status(err.message === "Booking not found or access denied" ? 404 : 500).json({ error: err.message });
    }
};
