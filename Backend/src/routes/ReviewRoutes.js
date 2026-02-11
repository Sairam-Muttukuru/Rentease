const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/ReviewController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

// Get reviews for the logged-in provider
router.get("/my-reviews", AuthMiddleware, ReviewController.getMyReviews);

// Add review (Usually by a customer, but adding here for completeness/testing)
router.post("/", AuthMiddleware, ReviewController.addReview);

module.exports = router;
