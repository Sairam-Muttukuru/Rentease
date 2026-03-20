const Complaint = require("../../models/complaint/ComplaintModel");
const Tenant = require("../../models/tenant/TenantModel");
const ComplaintImage = require("../../models/complaint/ComplaintImageModel");
const User = require("../../models/common/UserModel"); // ✅ ADD
const sendComplaintMail = require("../../utils/email/sendComplaintMail"); // ✅ ADD

const Notification = require("../../models/common/NotificationModel");

exports.createComplaint = async (userId, data) => {

    // 1️⃣ Get tenant details
    const tenants = await Tenant.getByUserId(userId);
    const tenant = Array.isArray(tenants) ? tenants[0] : tenants;
    console.log("Fetched tenant for complaint:", tenant);
    if (!tenant) {
        console.error("Tenant not found for userId:", userId);
        throw new Error("Tenant not found");
    }

    // 2️⃣ Create complaint
    const complaint = await Complaint.create({
        tenant_id: tenant.id,
        landlord_id: tenant.landlord_id,
        property_id: tenant.property_id,
        title: data.title,
        description: data.description,
        category: data.category,
        priority_level: data.priority_level || "Low"
    });

    // 3️⃣ Save images (if any)
    if (data.images && data.images.length > 0) {
        for (const img of data.images) {
            await ComplaintImage.addImage(complaint.id, img);
        }
    }

    // 4️⃣ 🔔 NOTIFICATIONS (Fail-safe)
    try {
        const landlord = await User.getUserById(tenant.landlord_id);
        console.log("🏠 Landlord fetched:", landlord?.email, "| Tenant:", tenant?.full_name, "| Property:", tenant?.property_name);

        if (landlord) {
            // Create In-App Notification
            await Notification.create({
                user_id: tenant.landlord_id,
                type: "complaint",
                title: `New Complaint: ${data.title}`,
                message: `${tenant.full_name || 'A tenant'} raised a complaint regarding ${data.title} at ${tenant.property_name || 'your property'}. Priority: ${data.priority_level || 'Low'}.`
            });

            if (landlord.email) {
                const propertyImage = (tenant.images && tenant.images.length > 0) ? tenant.images[0] : null;
                console.log(`📧 Sending complaint email to: ${landlord.email}`);
                // Await here so we can catch errors clearly
                await sendComplaintMail({
                    landlordEmail: landlord.email,
                    landlordName: landlord.first_name || 'Landlord',
                    tenantName: tenant.full_name || "A Tenant",
                    propertyName: tenant.property_name || "Property",
                    propertyImage,
                    complaint
                });
                console.log("✅ Complaint email sent successfully to:", landlord.email);
            } else {
                console.warn("⚠️ Landlord has no email address — skipping complaint email");
            }
        } else {
            console.warn("⚠️ No landlord found for landlord_id:", tenant.landlord_id);
        }
    } catch (notifyErr) {
        console.error("⚠️ Notification/email failed but complaint was created:", notifyErr);
        // Do not throw error, allowing complaint creation to succeed
    }

    // 5️⃣ Return response
    return complaint;
};

exports.getTenantComplaints = async (userId) => {
    const tenants = await Tenant.getByUserId(userId);
    const tenant = Array.isArray(tenants) ? tenants[0] : tenants;
    console.log("Fetched tenant for userId", userId, ":", tenant);
    if (!tenant) throw new Error("Tenant not found");

    return await Complaint.getByTenantId(tenant.id);
};

exports.getLandlordComplaints = async (landlordId) => {
    console.log("Fetched landlord for landlordId", landlordId, ":", landlordId);
    return await Complaint.getByLandlordId(landlordId);
};

exports.updateComplaintStatus = async (complaintId, status) => {
    return await Complaint.updateStatus(complaintId, status);
};
