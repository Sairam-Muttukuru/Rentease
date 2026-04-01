const AdminModel = require("../../models/admin/AdminModel");

/**
 * Service to handle audit logging consistently across the application.
 */
class AuditService {
    /**
     * Log an action to the admin audit logs.
     * @param {number} actorId - ID of the user performing the action.
     * @param {string} action - Descriptive string of the action.
     */
    static async log(actorId, action) {
        try {
            console.log(`[AUDIT LOG] User ${actorId}: ${action}`);
            await AdminModel.logAction(actorId, action);
        } catch (err) {
            console.error("❌ Failed to create audit log:", err.message);
        }
    }

    // Helper methods for common actions
    static async logPropertyAction(actorId, propertyId, actionType, details = "") {
        const action = `${actionType} Property (ID: ${propertyId})${details ? ` - ${details}` : ""}`;
        return this.log(actorId, action);
    }

    static async logTenantAction(actorId, tenantId, propertyId, actionType, details = "") {
        const action = `${actionType} Tenant (ID: ${tenantId}) for Property (ID: ${propertyId})${details ? ` - ${details}` : ""}`;
        return this.log(actorId, action);
    }

    static async logUserAction(actorId, targetUserId, actionType, details = "") {
        const action = `${actionType} User (ID: ${targetUserId})${details ? ` - ${details}` : ""}`;
        return this.log(actorId, action);
    }
}

module.exports = AuditService;
