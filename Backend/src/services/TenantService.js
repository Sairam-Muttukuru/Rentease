const Tenant = require("../models/TenantModel");
const TenantMember = require("../models/TenantMemberModel");
const Property = require("../models/PropertyModel");
const UserModel = require("../models/UserModel");

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

exports.getDashboardData = async (userId) => {
  // 1️⃣ Get tenant + property + images
  const tenant = await Tenant.getByUserId(userId);

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
      tenant_name: `${user.first_name} ${user.last_name}`,
      tenant_email: user.email,
      phone: user.phone,

      members: [],
      familyMembers: 0
    };
  }

  // 3️⃣ Get family members
  const members = await TenantMember.getByTenantId(tenant.id);

  // 4️⃣ Return merged response
  return {
    ...tenant,

    // 👇 tenant user info
    tenant_name: `${user.first_name} ${user.last_name}`,
    tenant_email: user.email,

    members,
    familyMembers: members.length
  };
};

exports.getPayments = async (userId) => {
  const tenant = await Tenant.getByUserId(userId);
  if (!tenant) return [];

  return await Tenant.getPaymentsByTenantId(tenant.id);
};

exports.updateTenantProfile = async (userId, data) => {
  // 1. Update User Table (Name, Email)
  const nameParts = data.full_name ? data.full_name.split(' ') : [];
  const firstName = nameParts.length > 0 ? nameParts[0] : undefined;
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

  await UserModel.updateUser(userId, {
    first_name: firstName,
    last_name: lastName,
    email: data.email
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
