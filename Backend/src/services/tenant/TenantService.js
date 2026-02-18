const Tenant = require("../../models/tenant/TenantModel");
const TenantMember = require("../../models/tenant/TenantMemberModel");
const Property = require("../../models/landlord/PropertyModel");
const UserModel = require("../../models/common/UserModel");
const Complaint = require("../../models/complaint/ComplaintModel");
const ServiceRequestModel = require("../../models/serviceProvider/ServiceRequestModel");
const sendTenantInvitationEmail = require("../../utils/email/sendTenantInvitationEmail");

// ... existing code ...

exports.getPayments = async (requesterId, targetUserName = null) => {
  let userId = requesterId;

  if (targetUserName) {
    const targetUser = await UserModel.findUserBySlug(targetUserName);
    if (!targetUser) throw new Error("Tenant not found");

    // Allow if searching for self
    if (targetUser.id !== requesterId) {
      // Verify landlord handles this tenant
      const tenantRecord = await Tenant.getByUserId(targetUser.id);
      if (!tenantRecord || tenantRecord.landlord_id != requesterId) {
        throw new Error("Access denied");
      }
    }
    userId = targetUser.id;
  }

  const tenant = await Tenant.getByUserId(userId);
  if (!tenant) return [];

  const payments = await Tenant.getPaymentsByTenantId(tenant.id);

  // Map payment_date to date for frontend
  return payments.map(p => ({
    ...p,
    date: p.payment_date,
    receipt_number: p.receipt_no // ensuring optional field mapping if needed
  }));
};

exports.getComplaints = async (requesterId, targetUserName = null) => {
  let userId = requesterId;

  if (targetUserName) {
    const targetUser = await UserModel.findUserBySlug(targetUserName);
    if (!targetUser) throw new Error("Tenant not found");

    // Allow if searching for self
    if (targetUser.id !== requesterId) {
      const tenantRecord = await Tenant.getByUserId(targetUser.id);
      if (!tenantRecord || tenantRecord.landlord_id != requesterId) {
        throw new Error("Access denied");
      }
    }
    userId = targetUser.id;
  }

  const tenant = await Tenant.getByUserId(userId);
  if (!tenant) return [];

  return await Complaint.getByTenantId(tenant.id);
};

exports.addTenant = async (landlordId, propertyId, data) => {
  // 🔒 check property ownership
  const property = await Property.getPropertyById(propertyId);
  if (!property || property.landlord_id != landlordId) {
    throw new Error("Unauthorized property");
  }

  // 🔒 check if tenant already exists
  const existing = await Tenant.getByPropertyId(propertyId);
  if (existing) {
    throw new Error("Tenant already exists for this property");
  }

  // Handle both flat and nested structure (fallback for safety)
  const full_name = data.primary_member?.full_name || data.full_name;
  const phone = data.primary_member?.phone || data.phone;
  const email = data.primary_member?.email || data.email;
  const monthly_rent = data.monthly_rent;
  const tenant_type = data.tenant_type;

  if (!full_name || !tenant_type || !monthly_rent) {
    throw new Error("Required fields missing");
  }

  // 🔒 Verify user exists
  const existingUser = await UserModel.findUserByEmail(email);
  if (!existingUser) {
    throw new Error("User does not exist. Please register the user first.");
  }

  // 1️⃣ Insert tenant
  const tenant = await Tenant.create({
    landlord_id: landlordId,
    property_id: propertyId,
    tenant_type: tenant_type.toUpperCase(), // Ensure uppercase for DB constraint
    monthly_rent: monthly_rent,
    payment_status: (data.payment_status || 'PENDING').toUpperCase(),
    user_id: existingUser.id,
    start_date: data.start_date,
    rent_due_date: data.rent_due_date
  });

  // 2️⃣ Insert primary member
  await TenantMember.create({
    tenant_id: tenant.id,
    full_name: full_name,
    phone: phone,
    relation: "Self",
    is_primary: true,
    tenant_emailid: email
  });

  // 3️⃣ Send Invitation Email (Fire-and-forget)
  const landlordUserPromise = UserModel.findUserById(landlordId);

  landlordUserPromise.then(async (landlordUser) => {
    try {
      await sendTenantInvitationEmail({
        tenantEmail: email,
        tenantName: full_name,
        landlordName: landlordUser ? `${landlordUser.first_name} ${landlordUser.last_name}` : "Your Landlord",
        propertyName: property.title,
        propertyAddress: property.address,
        monthlyRent: monthly_rent,
        startDate: data.start_date,
        rentDueDate: data.rent_due_date,
        propertyImageUrl: (property.images && property.images.length > 0) ? property.images[0].url : null
      });
    } catch (emailError) {
      console.error("Failed to send tenant invitation email:", emailError);
    }
  });

  return tenant;
};

exports.updateTenant = async (landlordId, tenantId, data) => {
  // Update tenant table (rent, type)
  const tenant = await Tenant.update(tenantId, landlordId, {
    ...data,
    tenant_type: data.tenant_type?.toUpperCase(),
    payment_status: data.payment_status?.toUpperCase()
  });

  // Map frontend 'name' to backend 'full_name'
  if (data.name) {
    data.full_name = data.name;
  }

  // Update primary member (name, phone, email) if provided
  if (data.full_name || data.phone || data.email) {
    await TenantMember.updatePrimaryByTenantId(tenantId, data);
  }

  return tenant;
};

exports.deleteTenant = async (landlordId, tenantId) => {
  return await Tenant.delete(tenantId, landlordId);
};

exports.getTenantByProperty = async (landlordId, propertyId) => {
  return await Tenant.getFullTenantByProperty(propertyId, landlordId);
};

exports.getAllTenants = async (landlordId) => {
  return await Tenant.getAllByLandlordId(landlordId);
};

exports.getDashboardData = async (requesterId, targetUserName = null) => {
  let userId = requesterId;

  if (targetUserName) {
    const targetUser = await UserModel.findUserBySlug(targetUserName);
    if (!targetUser) throw new Error("Tenant not found");

    // Allow if searching for self
    if (targetUser.id !== requesterId) {
      // Verify landlord handles this tenant
      const tenantRecord = await Tenant.getByUserId(targetUser.id);
      if (!tenantRecord || tenantRecord.landlord_id != requesterId) {
        throw new Error("Access denied");
      }
    }
    userId = targetUser.id;
  }

  // 1️⃣ Get tenant + property + images
  const tenant = await Tenant.getByUserId(userId);

  // 1.5 Get service requests
  const serviceRequests = await ServiceRequestModel.getByUser(userId);

  // 2️⃣ Get tenant user info
  const user = await UserModel.findUserById(userId);

  if (!tenant) {
    // ⚠️ Fallback if user is not assigned to any property yet
    return {
      id: null,
      property_name: "No Property Assigned",
      address: "Please contact your landlord to be added.",
      city: "",
      state: "",
      zip_code: "",
      landlord_name: "N/A",
      monthly_rent: 0,
      payment_status: "N/A",
      start_date: null,
      rent_due_date: null,
      images: [],

      // Tenant User Info
      tenant_name: user ? `${user.first_name} ${user.last_name}` : "Unknown",
      tenant_email: user ? user.email : "N/A",
      phone: user ? user.phone : "N/A",

      members: [],
      familyMembers: 0
    };
  }

  // 3️⃣ Get family members
  const members = await TenantMember.getByTenantId(tenant.id);

  // 4️⃣ Calculate Accumulated Rent
  const payments = await Tenant.getPaymentsByTenantId(tenant.id);
  const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const currentDate = new Date();
  const startDate = new Date(tenant.start_date);

  // Calculate months elapsed (including current month if start date passed)
  const monthsElapsed = Math.max(1,
    (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
    (currentDate.getMonth() - startDate.getMonth()) +
    (currentDate.getDate() >= startDate.getDate() ? 1 : 0)
  );

  let expectedRent = monthsElapsed * parseFloat(tenant.monthly_rent);
  let accumulatedDue = Math.max(0, expectedRent - totalPaid);

  // 10-Day Policy Logic: 
  // If there is an outstanding balance AND we are > 10 days past the current cycle's due date,
  // we proactively add the NEXT month's rent to the "Accumulated Due".
  if (accumulatedDue > 0) {
    // Determine the "Current" Due Date (the one that triggered the current expectedRent)
    // This is effectively StartDate + (monthsElapsed - 1) months
    const currentDueDate = new Date(startDate);
    currentDueDate.setMonth(startDate.getMonth() + (monthsElapsed - 1));

    // Calculate days past this due date
    const diffTime = Math.abs(currentDate - currentDueDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If we are more than 10 days past the due date (e.g., Due Feb 1, Today Feb 12)
    if (diffDays > 10) {
      accumulatedDue += parseFloat(tenant.monthly_rent);
    }
  }

  // 5️⃣ Return merged response
  return {
    ...tenant,
    // Map mismatched fields for frontend
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    propertyName: tenant.property_name,
    landlord: tenant.landlord_name,
    monthlyRent: tenant.monthly_rent,
    propertyImages: tenant.images,

    accumulated_due: accumulatedDue,
    months_elapsed: monthsElapsed,
    total_paid: totalPaid,

    // Keep existing backend fields just in case
    tenant_name: `${user.first_name} ${user.last_name}`,
    tenant_email: user.email,
    phone: user.phone,
    avatar_url: user.avatar_url,

    members,
    familyMembers: members.length,
    serviceRequests
  };
};

exports.updateTenantProfile = async (userId, data) => {
  // 1. Update User Table (Name, Email)
  const nameParts = data.full_name ? data.full_name.split(' ') : [];
  const firstName = nameParts.length > 0 ? nameParts[0] : undefined;
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

  await UserModel.updateUser(userId, {
    first_name: firstName,
    last_name: lastName,
    email: data.email,
    phone: data.phone,
    avatar_url: data.avatar_url
  });

  // 2. Update Tenant Member Table (Phone, Name, Email)
  const tenant = await Tenant.getByUserId(userId);
  if (tenant) {
    await TenantMember.updatePrimaryByTenantId(tenant.id, {
      full_name: data.full_name,
      email: data.email,
      phone: data.phone
    });
  }

  return { message: "Profile updated successfully" };
};
