const Notification = require("../models/NotificationModel");

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.getByUserId(req.user.id);
        res.json(notifications);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.markAsRead(req.params.id);
        res.json(notification);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.markAllAsRead(req.user.id);
        res.json({ message: "All notifications marked as read" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
