const Tenant = require("../../models/tenant/TenantModel");
const Member = require("../../models/tenant/TenantMemberModel");
const Property = require("../../models/landlord/PropertyModel");
const User = require("../../models/common/UserModel");

exports.addMember = async (landlordId, tenantId, data) => {
  const tenant = await Tenant.getById(tenantId);
  if (!tenant || tenant.landlord_id != landlordId) {
    throw new Error("Unauthorized tenant access");
  }

  // 🔒 Security Check for Shared Types
  const property = await Property.getPropertyById(tenant.property_id);
  const pType = (property.property_type || "").toUpperCase();
  const fType = (property.family_type || "").toUpperCase();
  const isShared = pType.includes('PG') || pType.includes('HOSTEL') || fType === 'BACHELORS';

  if (isShared) {
    if (!data.email) throw new Error("Email is mandatory for PG roommates");
    const existingUser = await User.findUserByEmail(data.email);
    if (!existingUser) {
      throw new Error(`Security Alert: Roommate account for '${data.email}' not found. To add a roommate to a PG/Hostel, they must first register an account on RentEase.`);
    }
  }

  return await Member.create({
    tenant_id: tenantId,
    full_name: data.full_name,
    phone: data.phone,
    relation: isShared ? "Roommate" : data.relation,
    is_primary: false,
    tenant_emailid: data.email
  });
};

exports.getAllMembers = async (landlordId, tenantId) => {
  const tenant = await Tenant.getById(tenantId);
  console.log("DEBUG MemberAuth:", { landlordId, tenantId, tenantLandlordId: tenant?.landlord_id });

  if (!tenant || tenant.landlord_id != landlordId) {
    throw new Error("Unauthorized access");
  }

  return Member.getByTenantId(tenantId);
};


exports.updateMember = async (landlordId, memberId, data) => {
  const member = await Member.getById(memberId);

  if (!member || member.landlord_id !== landlordId) {
    throw new Error("Unauthorized access");
  }

  return await Member.update(memberId, data);
};

exports.deleteMember = async (landlordId, memberId) => {
  const member = await Member.getById(memberId);

  if (!member || member.landlord_id !== landlordId) {
    throw new Error("Unauthorized access");
  }

  await Member.delete(memberId);
};
