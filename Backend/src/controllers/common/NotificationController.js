const NotificationService = require("../../services/common/NotificationService");

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await NotificationService.getNotifications(req.user.id);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const notification = await NotificationService.markAsRead(req.params.id);
        res.json(notification);
    } catch (err) {
        res.status(err.message === "Notification not found" ? 404 : 500).json({ error: err.message });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        await NotificationService.markAllAsRead(req.user.id);
        res.json({ message: "All notifications marked as read" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.requestVacate = async (req, res) => {
    try {
        const result = await NotificationService.requestVacate(req.user.id, req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
