const NotificationModel = require("../../models/common/NotificationModel");

class NotificationService {
    async getNotifications(userId) {
        return await NotificationModel.getByUserId(userId);
    }

    async markAsRead(notificationId) {
        const notification = await NotificationModel.markAsRead(notificationId);
        if (!notification) throw new Error("Notification not found");
        return notification;
    }

    async markAllAsRead(userId) {
        return await NotificationModel.markAllAsRead(userId);
    }

    async createNotification(userId, type, title, message) {
        return await NotificationModel.create({
            user_id: userId,
            type,
            title,
            message
        });
    }
}

module.exports = new NotificationService();
