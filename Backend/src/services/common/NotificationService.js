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

    async requestVacate(tenantId, data) {
        const { moveOutDate, reason, propertyName, tenantName, landlordId } = data;
        
        // 1. Get Landlord Email
        const UserModel = require("../../models/common/UserModel");
        const landlord = await UserModel.findUserById(landlordId);
        
        if (!landlord) throw new Error("Landlord not found");

        // 2. Create in-app notification
        await this.createNotification(
            landlordId,
            'vacate', // Changed from generic notification to 'vacate' type
            'Vacate Notice Received',
            `${tenantName} has requested to vacate ${propertyName} on ${new Date(moveOutDate).toLocaleDateString()}.`
        );

        // 3. Send professional email
        const sendVacateNoticeEmail = require("../../utils/email/sendVacateNoticeEmail");
        await sendVacateNoticeEmail(landlord.email, {
            tenantName,
            propertyName,
            moveOutDate,
            reason,
            landlordName: `${landlord.first_name} ${landlord.last_name}`
        });

        return { success: true };
    }
}

module.exports = new NotificationService();
