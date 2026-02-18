const Tenant = require("../../models/tenant/TenantModel");
const Member = require("../../models/tenant/TenantMemberModel");

exports.addMember = async (landlordId, tenantId, data) => {
  const tenant = await Tenant.getById(tenantId);

  if (!tenant || tenant.landlord_id != landlordId) {
    throw new Error("Unauthorized tenant access");
  }

  return await Member.create({
    tenant_id: tenantId,
    full_name: data.full_name,
    phone: data.phone,
    relation: data.relation,
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
