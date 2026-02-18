const Announcement = require('../../models/common/AnnouncementModel');

const TenantModel = require('../../models/tenant/TenantModel');
const sendAnnouncementEmail = require('../../utils/email/sendAnnouncementEmail');

exports.createAnnouncement = async (req, res) => {
    try {
        const { title, category, priority, content, audience, property_id, target_type, target_tenant_id } = req.body;
        const landlord_id = req.user.id; // From auth middleware
        const landlordName = `${req.user.first_name || 'Landlord'} ${req.user.last_name || ''}`.trim();

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
        let tenantsToNotify = [];

        if (target_type === 'specific' && target_tenant_id) {
            // Fetch single tenant
            // Fetch single tenant with full details (email, name from joined tables)
            // reusing getFullTenantByProperty to ensure we get the same rich object structure
            const allTenants = await TenantModel.getFullTenantByProperty(property_id, landlord_id);
            const targetTenant = allTenants.find(t => t.id == target_tenant_id);

            if (targetTenant) {
                tenantsToNotify.push(targetTenant);
            } else {
                console.warn(`Target tenant ${target_tenant_id} not found in property ${property_id}`);
            }
        } else {
            // Fetch all tenants in property
            tenantsToNotify = await TenantModel.getFullTenantByProperty(property_id, landlord_id);
        }

        console.log(`Found ${tenantsToNotify.length} tenants to notify`);

        // Send emails asynchronously (don't block response)
        tenantsToNotify.forEach(async (tenant) => {
            console.log("Processing tenant for email:", tenant.id, tenant.name, tenant.email);
            if (tenant.email) {
                try {
                    await sendAnnouncementEmail({
                        tenantEmail: tenant.email,
                        tenantName: tenant.name || 'Tenant',
                        landlordName: landlordName,
                        announcementTitle: title,
                        announcementContent: content,
                        announcementCategory: category,
                        announcementPriority: priority || 'medium'
                    });
                    console.log(`Email successfully sent to ${tenant.email}`);
                } catch (err) {
                    console.error(`Failed to send email to ${tenant.email}:`, err);
                }
            } else {
                console.warn(`Tenant ${tenant.id} has no email address.`);
            }
        });

        res.status(201).json(newAnnouncement);
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
