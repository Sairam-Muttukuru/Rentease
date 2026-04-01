const Announcement = require('../../models/common/AnnouncementModel');
const TenantModel = require('../../models/tenant/TenantModel');
const PropertyModel = require('../../models/landlord/PropertyModel');
const UserModel = require('../../models/common/UserModel');
const sendAnnouncementEmail = require('../../utils/email/sendAnnouncementEmail');

exports.createAnnouncement = async (req, res) => {
    try {
        const { title, category, priority, content, audience, property_id, target_type, target_tenant_id } = req.body;
        const landlord_id = req.user.id; // From auth middleware


        if (!title || !content || !category || !property_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newAnnouncement = await Announcement.create({
            landlord_id,
            property_id,
            title,
            category,
            priority: priority || 'medium',
            content,
            audience,
            target_type: target_type || 'all',
            target_tenant_id: target_tenant_id || null
        });

        // Email Notification Logic
        const landlord = await UserModel.findUserById(landlord_id);
        const landlordName = landlord ? `${landlord.first_name} ${landlord.last_name || ''}`.trim() : 'Your Landlord';
        
        const property = await PropertyModel.getPropertyById(property_id);
        const propertyName = property?.title || 'Your Managed Property';
        const roomNumber = property?.flat_number || '';

        let tenantsToNotify = [];

        if (target_type === 'specific' && target_tenant_id) {
            const allTenants = await TenantModel.getFullTenantByProperty(property_id, landlord_id);
            const targetTenant = allTenants.find(t => t.id == target_tenant_id);
            if (targetTenant) tenantsToNotify.push(targetTenant);
        } else {
            tenantsToNotify = await TenantModel.getFullTenantByProperty(property_id, landlord_id);
        }

        res.status(201).json(newAnnouncement);

        // Perform email sending in background (non-blocking)
        (async () => {
            console.log(`Background process: Found ${tenantsToNotify.length} tenants to notify`);
            const propertyImage = property?.images?.[0]?.url || null;

            for (const tenant of tenantsToNotify) {
                if (tenant.email) {
                    try {
                        await sendAnnouncementEmail({
                            tenantEmail: tenant.email,
                            tenantName: tenant.name || 'Tenant',
                            landlordName: landlordName,
                            propertyName: propertyName,
                            roomNumber: roomNumber,
                            propertyImage: propertyImage,
                            announcementTitle: title,
                            announcementContent: content,
                            announcementCategory: category,
                            announcementPriority: priority || 'medium'
                        });
                        console.log(`✅ Background: Email sent to ${tenant.email}`);
                    } catch (err) {
                        console.error(`❌ Background: Failed to send email to ${tenant.email}:`, err);
                    }
                }
            }
        })();
    } catch (error) {
        console.error("Error creating announcement:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getLandlordAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.getAllByLandlord(req.user.id);
        res.status(200).json(announcements);
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        await Announcement.delete(id);
        res.status(200).json({ message: "Announcement deleted" });
    } catch (error) {
        console.error("Error deleting announcement:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getTenantAnnouncements = async (req, res) => {
    try {
        // Find tenant record for this user
        const tenantRecord = await TenantModel.getByUserId(req.user.id);

        if (!tenantRecord) {
            return res.status(404).json({ error: "Tenant record not found" });
        }

        const announcements = await Announcement.getAllForTenant(tenantRecord.property_id, tenantRecord.id);
        res.status(200).json(announcements);
    } catch (error) {
        console.error("Error fetching tenant announcements:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
