const Tenant = require("../../models/tenant/TenantModel");
const Member = require("../../models/tenant/TenantMemberModel");
const Property = require("../../models/landlord/PropertyModel");
const User = require("../../models/common/UserModel");
const sendTenantInvitationEmail = require("../../utils/email/sendTenantInvitationEmail");
const sendTenantRemovalEmail = require("../../utils/email/sendTenantRemovalEmail");

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

  const newMember = await Member.create({
    tenant_id: tenantId,
    full_name: data.full_name,
    phone: data.phone,
    relation: isShared ? "Roommate" : data.relation,
    is_primary: false,
    tenant_emailid: data.email,
    lease_start: data.lease_start,
    lease_end: data.lease_end,
    rent_amount: data.rent_amount || 0,
    rent_due_day: data.rent_due_day || 1
  });

  // 📧 Send Welcome Invitation Email
  if (data.email) {
      const landlord = await User.findById(landlordId);
      await sendTenantInvitationEmail({
          tenantEmail: data.email,
          tenantName: data.full_name,
          landlordName: landlord.name,
          propertyName: property.title,
          propertyAddress: `${property.locality}, ${property.city}`,
          monthlyRent: data.rent_amount || tenant.monthly_rent, // Use member-specific rent if provided
          startDate: data.lease_start || tenant.start_date,
          rentDueDate: data.rent_due_day || tenant.rent_due_date || 1, // Use member-specific due date
          propertyImageUrl: property.images?.find(img => img.is_cover)?.image_url || property.images?.[0]?.image_url
      });
  }

  return newMember;
};

exports.getAllMembers = async (landlordId, tenantId) => {
  const tenant = await Tenant.getById(tenantId);
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

  // 📧 Send Removal Email BEFORE deleting
  if (member.tenant_emailid) {
      const tenant = await Tenant.getById(member.tenant_id);
      const property = await Property.getPropertyById(tenant.property_id);
      const landlord = await User.findById(landlordId);

      await sendTenantRemovalEmail({
          tenantEmail: member.tenant_emailid,
          tenantName: member.full_name,
          landlordName: landlord.name,
          propertyName: property.title,
          propertyAddress: `${property.locality}, ${property.city}`
      });
  }

  await Member.delete(memberId);
};
