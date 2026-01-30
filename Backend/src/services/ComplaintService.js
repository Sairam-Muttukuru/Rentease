const Complaint = require("../models/ComplaintModel");
const Tenant = require("../models/TenantModel");
const ComplaintImage = require("../models/ComplaintImageModel");
const User = require("../models/UserModel"); // ✅ ADD
const sendComplaintMail = require("../utils/sendComplaintMail"); // ✅ ADD

const Notification = require("../models/NotificationModel");

exports.createComplaint = async (userId, data) => {

    // 1️⃣ Get tenant details
    const tenant = await Tenant.getByUserId(userId);
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

        if (landlord) {
            // Create In-App Notification
            await Notification.create({
                user_id: tenant.landlord_id, // ✅ Fix: Use ID from tenant object
                type: "complaint",
                title: `New Complaint: ${data.title}`,
                message: `${tenant.full_name || 'A tenant'} raised a complaint regarding ${data.title} at ${tenant.property_name || 'your property'}. Priority: ${data.priority_level || 'Low'}.`
            });

            if (landlord.email) {
                // Fire and forget email - don't await
                sendComplaintMail({
                    landlordEmail: landlord.email,
                    landlordName: landlord.first_name,
                    tenantName: tenant.full_name || "A Tenant",
                    propertyName: tenant.property_name || "Property",
                    propertyImage: (tenant.images && tenant.images.length > 0) ? tenant.images[0] : null,
                    complaint
                }).catch(err => console.error("Background email error:", err));
            }
        }
    } catch (notifyErr) {
        console.error("⚠️ Notification failed but complaint was created:", notifyErr);
        // Do not throw error, allowing complaint creation to succeed
    }

    // 5️⃣ Return response
    return complaint;
};

exports.getTenantComplaints = async (userId) => {
    const tenant = await Tenant.getByUserId(userId);
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
