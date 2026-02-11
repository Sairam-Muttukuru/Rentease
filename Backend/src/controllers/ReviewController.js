const ReviewModel = require("../models/ReviewModel");
const ProviderModel = require("../models/ServiceProviderModel");

exports.addReview = async (req, res) => {
    try {
        // Assuming req.body contains provider_id, rating, comment
        // user_id comes from req.user.id (authenticated user)
        const review = await ReviewModel.addReview({
            ...req.body,
            user_id: req.user.id
        });
        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMyReviews = async (req, res) => {
    try {
        const providerId = await ProviderModel.getProviderId(req.user.id);
        if (!providerId) return res.status(404).json({ error: "Provider not found" });

        const reviews = await ReviewModel.getReviewsByProvider(providerId);
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
