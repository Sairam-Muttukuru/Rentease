const MessageModel = require("../../models/common/MessageModel");
const socketService = require("../../services/common/SocketService");

/**
 * Get chat messages between current user and another user
 */
exports.getChat = async (req, res) => {
    try {
        const userId = req.user.id;
        const contactId = req.params.contactId;

        if (!contactId) {
            return res.status(400).json({ message: "Contact ID is required" });
        }

        const messages = await MessageModel.getChatMessages(userId, contactId);
        
        // Mark messages from contact to current user as read
        await MessageModel.markAsRead(contactId, userId);

        res.status(200).json(messages);
    } catch (err) {
        console.error("Error in getChat:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Send a message
 */
exports.sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { receiverId, text } = req.body;

        if (!receiverId || !text) {
            return res.status(400).json({ message: "Receiver ID and message text are required" });
        }

        const message = await MessageModel.sendMessage(senderId, receiverId, text);
        
        // Emit real-time message to receiver
        socketService.emitToUser(receiverId, "new_message", {
            ...message,
            sender: 'tenant', // UI will normalize
            text: message.message_text,
            timestamp: new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date(message.created_at).toLocaleDateString()
        });

        // Emit unread count update to receiver heart
        const unreadCounts = await MessageModel.getUnreadCounts(receiverId);
        const specificUnread = unreadCounts.find(c => Number(c.contact_id) === Number(senderId))?.unread_count || 0;
        
        socketService.emitToUser(receiverId, "unread_update", {
            contact_id: senderId,
            unread_count: specificUnread
        });

        res.status(201).json(message);
    } catch (err) {
        console.error("Error in sendMessage:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get all conversations for current user
 */
exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await MessageModel.getConversations(userId);
        res.status(200).json(conversations);
    } catch (err) {
        console.error("Error in getConversations:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Check if a user is online
 */
exports.getUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const isOnline = socketService.isUserOnline(userId);
        res.status(200).json({ userId, status: isOnline ? "online" : "offline" });
    } catch (err) {
        res.status(500).json({ message: "Error checking status" });
    }
};
/**
 * Get unread counts for current user
 */
exports.getUnreadCounts = async (req, res) => {
    try {
        const userId = req.user.id;
        const counts = await MessageModel.getUnreadCounts(userId);
        res.status(200).json(counts);
    } catch (err) {
        console.error("Error in getUnreadCounts:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
