const express = require("express");
const router = express.Router();
const MessageController = require("../../controllers/common/MessageController");
const authMiddleware = require("../../middlewares/AuthMiddleware");

// All message routes require authentication
router.use(authMiddleware);

// Get all conversations for current user
router.get("/conversations", MessageController.getConversations);

// Get chat history with a specific user
router.get("/chat/:contactId", MessageController.getChat);

// Send a message
router.post("/send", MessageController.sendMessage);

// Get user online status
router.get("/status/:userId", MessageController.getUserStatus);

// Get unread counts for all contacts heart
router.get("/unread-counts", MessageController.getUnreadCounts);

module.exports = router;
