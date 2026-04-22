const Tenant = require("../../models/tenant/TenantModel");
const TenantMember = require("../../models/tenant/TenantMemberModel");
const Property = require("../../models/landlord/PropertyModel");
const UserModel = require("../../models/common/UserModel");
const Complaint = require("../../models/complaint/ComplaintModel");
const ServiceRequestModel = require("../../models/serviceProvider/ServiceRequestModel");
const sendTenantInvitationEmail = require("../../utils/email/sendTenantInvitationEmail");
const sendTenantRemovalEmail = require("../../utils/email/sendTenantRemovalEmail");
const logger = require("../../utils/logger");

// Helper to get YYYY-MM-DD in IST (handles UTC-stored dates from PostgreSQL)
const getYMD = (d) => {
  if (!d) return null;
  // DB stores as UTC. Add IST offset (5h30m) to get the local date
  const date = new Date(d);
  const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
  const year = istDate.getUTCFullYear();
  const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(istDate.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const _calculateLateFees = (tenant, rentPayments, today) => {
  if (!tenant.start_date) return 0;

  const anchorDateRaw = tenant.rent_due_date ? new Date(tenant.rent_due_date) : new Date(tenant.start_date);
  const anchorDateIST = new Date(anchorDateRaw.getTime() + (5.5 * 60 * 60 * 1000));
  const anchorDate = new Date(Date.UTC(anchorDateIST.getUTCFullYear(), anchorDateIST.getUTCMonth(), anchorDateIST.getUTCDate(), 12, 0, 0, 0));

  const latePenalty = parseFloat(tenant.latePenaltyAmount || 0);
  let totalPenalty = 0;
  
  // Calculate months based on calendar cycles rather than hardcoded 31 days
  const monthsDiff = (today.getFullYear() - anchorDate.getFullYear()) * 12 + (today.getMonth() - anchorDate.getMonth());
  const cyclesToCharge = Math.max(0, monthsDiff + 1);

  for (let i = 0; i < cyclesToCharge; i++) {
    const cycleStartDate = new Date(anchorDate);
    cycleStartDate.setMonth(anchorDate.getMonth() + i);
    const cycleDateISO = getYMD(cycleStartDate);
    
    const isPaid = rentPayments.some(p => {
      if (!p.due_date) return false;
      return getYMD(p.due_date) === cycleDateISO;
    });

    if (!isPaid) {
      if (today > cycleStartDate) {
        const dDiff = Math.floor((today - cycleStartDate) / (1000 * 60 * 60 * 24));
        if (dDiff > 0) {
          totalPenalty += dDiff * latePenalty;
        }
      }
    }
  }

  return totalPenalty;
};

exports.getPayments = async (requesterId, targetUserName = null) => {
  let userId = requesterId;

  if (targetUserName) {
    const targetUser = await UserModel.findUserBySlug(targetUserName);
    if (!targetUser) throw new Error("Tenant not found");

    logger({ requesterId, targetUserId: targetUser.id, targetUserName }, "getPayments: PRE-ACCESS CHECK");

    // Allow if searching for self OR requester is ADMIN
    const isSelf = targetUser.id == requesterId;
    const requester = await UserModel.findUserById(requesterId);
    const isAdmin = requester?.role === 'ADMIN';

    logger({ isSelf, isAdmin }, "getPayments: ACCESS CHECK RESULTS");

    if (!isSelf && !isAdmin) {
      // Verify landlord handles this tenant
      const tenants = await Tenant.getByUserId(targetUser.id);
      const isManaged = tenants?.some(t => t.landlord_id == requesterId);
      logger(isManaged, "getPayments: IS MANAGED");
      if (!isManaged) {
        throw new Error(`Access denied: Requester ${requesterId} does not manage Target ${targetUser.id}`);
      }
    }
    userId = targetUser.id;
  }

  const tenants = await Tenant.getByUserId(userId);
  if (!tenants || tenants.length === 0) return [];

  const allPayments = [];
  for (const tenant of tenants) {
    const propertyPayments = await Tenant.getPaymentsByTenantId(tenant.id);
    allPayments.push(...propertyPayments);
  }

  // Sort by date desc
  allPayments.sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));

  // Map payment_date to date for frontend
  return allPayments.map(p => ({
    ...p,
    date: p.payment_date,
    receipt_number: p.receipt_no,
    method: p.payment_gateway || p.payment_method_ui || "Online"
  }));
};

exports.getComplaints = async (requesterId, targetUserName = null) => {
  let userId = requesterId;

  if (targetUserName) {
    const targetUser = await UserModel.findUserBySlug(targetUserName);
    if (!targetUser) throw new Error("Tenant not found");

    logger({ requesterId, targetUserId: targetUser.id, targetUserName }, "getComplaints: PRE-ACCESS CHECK");

    // Allow if searching for self OR requester is ADMIN
    const isSelf = targetUser.id == requesterId;
    const requester = await UserModel.findUserById(requesterId);
    const isAdmin = requester?.role === 'ADMIN';

    logger({ isSelf, isAdmin }, "getComplaints: ACCESS CHECK RESULTS");

    if (!isSelf && !isAdmin) {
      const tenants = await Tenant.getByUserId(targetUser.id);
      const isManaged = tenants?.some(t => t.landlord_id == requesterId);
      logger(isManaged, "getComplaints: IS MANAGED");
      if (!isManaged) {
        throw new Error(`Access denied: Requester ${requesterId} does not manage Target ${targetUser.id}`);
      }
    }
    userId = targetUser.id;
  }

  const tenants = await Tenant.getByUserId(userId);
  if (!tenants || tenants.length === 0) return [];

  const allComplaints = [];
  for (const tenant of tenants) {
    const propertyComplaints = await Complaint.getByTenantId(tenant.id);
    allComplaints.push(...propertyComplaints);
  }

  return allComplaints.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

exports.addTenant = async (landlordId, propertyId, data) => {
  // 🔒 check property ownership
  const property = await Property.getPropertyById(propertyId);
  if (!property || property.landlord_id != landlordId) {
    throw new Error("Unauthorized property");
  }

  const full_name = data.primary_member?.full_name || data.full_name;
  const phone = data.primary_member?.phone || data.phone;
  const trimmedEmail = (data.primary_member?.email || data.email || "").trim();
  const tenant_type = data.tenant_type || 'BACHELOR';

  if (!full_name || !trimmedEmail) {
    throw new Error("Required fields missing (Name and Email are mandatory)");
  }

  // 2️⃣ 🔒 Security & Registration Check
  const pType = (property.property_type || "").toUpperCase();
  const fType = (property.family_type || "").toUpperCase();
  const isSharedType = pType.includes('PG') || pType.includes('HOSTEL') || fType === 'BACHELORS';

  const existingUser = await UserModel.findUserByEmail(trimmedEmail);

  // For shared properties (PG/Bachelors), registration is mandatory
  if (isSharedType && !existingUser) {
    throw new Error(`Security Alert: The account for '${trimmedEmail}' was not found. For PG/Hostel or Bachelor properties, every tenant MUST register an account on RentEase before being added.`);
  }

  // 3️⃣ 💰 Rent Calculation & Splitting Logic
  let calculatedRent = parseFloat(property.price);
  const currentTenantsCount = await Tenant.getCountByPropertyId(propertyId);
  const newTotalTenants = currentTenantsCount + 1;

  if (pType.includes('PG') || pType.includes('HOSTEL')) {
    // PG Style: Everyone pays the full property price (which is "per person")
    calculatedRent = parseFloat(property.price);
  } else if (fType === 'BACHELORS') {
    // Bachelor Style: Total property price is split equally among all occupants
    calculatedRent = parseFloat(property.price) / newTotalTenants;
    
    // 🔥 Update rent for all existing roommates to reflect the new split
    await Tenant.updateAllRentsForProperty(propertyId, calculatedRent);
  } else {
    // Family/Couples: Single occupancy logic
    calculatedRent = parseFloat(property.price);
  }

  // 4️⃣ 🔒 Capacity Check
  if (currentTenantsCount >= (property.sharing_capacity || 1)) {
    throw new Error(`Forbidden: This property has reached its sharing capacity (${property.sharing_capacity} beds).`);
  }

  // 3.1 📅 Construction of due date as a full DATE (not just a day number)
  const baseDate = new Date(data.start_date || new Date());
  let rentDueFinal = data.rent_due_date;
  if (!rentDueFinal) {
    // If no specific due date, default to the start_date to ensure cycles align with move-in
    rentDueFinal = data.start_date || new Date().toISOString().split('T')[0];
  }

  // 5️⃣ Insert tenant
  const tenant = await Tenant.create({
    landlord_id: landlordId,
    property_id: propertyId,
    tenant_type: tenant_type.toUpperCase(),
    monthly_rent: calculatedRent,
    payment_status: (data.payment_status || 'PENDING').toUpperCase(),
    user_id: existingUser ? existingUser.id : null, 
    start_date: data.start_date || new Date().toISOString().split('T')[0],
    rent_due_date: rentDueFinal
  });

  // 2️⃣ Insert primary member
  await TenantMember.create({
    tenant_id: tenant.id,
    full_name: full_name,
    phone: phone,
    relation: "Self",
    is_primary: true,
    tenant_emailid: trimmedEmail
  });

  // 3️⃣ Send Invitation Email (Fire-and-forget)
  const landlordUserPromise = UserModel.findUserById(landlordId);

  landlordUserPromise.then(async (landlordUser) => {
    try {
      await sendTenantInvitationEmail({
        tenantEmail: trimmedEmail,
        tenantName: full_name,
        landlordName: landlordUser ? `${landlordUser.first_name} ${landlordUser.last_name}` : "Your Landlord",
        propertyName: property.title,
        propertyAddress: property.address,
        monthlyRent: calculatedRent,
        startDate: data.start_date,
        rentDueDate: data.rent_due_date,
        propertyImageUrl: (property.images && property.images.length > 0) ? property.images[0].url : null
      });
    } catch (emailError) {
      console.error("Failed to send tenant invitation email:", emailError);
    }
  });

  return { ...tenant, name: full_name };
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
  console.log(`[TenantService] Request to delete tenantId: ${tenantId} by landlordId: ${landlordId}`);
  
  // 1️⃣ Fetch tenant details before deletion for notification
  const tenantDetails = await Tenant.getDetailedById(tenantId);
  
  if (tenantDetails) {
    if (tenantDetails.landlord_id == landlordId) {
      // 2️⃣ Send Removal Email (Fire-and-forget)
      if (tenantDetails.tenant_email) {
        console.log(`[TenantService] Sending removal email to: ${tenantDetails.tenant_email}`);
        sendTenantRemovalEmail({
          tenantEmail: tenantDetails.tenant_email,
          tenantName: tenantDetails.tenant_name || "Tenant",
          landlordName: tenantDetails.landlord_name || "Your Landlord",
          propertyName: tenantDetails.property_name,
          propertyAddress: tenantDetails.property_address
        }).catch(err => console.error("[TenantService] Failed to send tenant removal email:", err));
      } else {
        console.warn(`[TenantService] No email found for tenantId: ${tenantId}, skipping notification.`);
      }
    } else {
      console.error(`[TenantService] Unauthorized delete attempt: tenant belongs to landlord ${tenantDetails.landlord_id}, but request from ${landlordId}`);
      throw new Error("Unauthorized: You do not manage this tenant");
    }
  } else {
    console.warn(`[TenantService] Tenant with id ${tenantId} not found or already deleted.`);
  }

  const result = await Tenant.delete(tenantId, landlordId);
  console.log(`[TenantService] Successfully deleted tenantId: ${tenantId}`);
  return result;
};


exports.getTenantByProperty = async (landlordId, propertyId) => {
  return await Tenant.getFullTenantByProperty(propertyId, landlordId);
};

exports.getAllTenants = async (landlordId) => {
  const tenants = await Tenant.getAllByLandlordId(landlordId);
  const today = new Date();

  for (const tenant of tenants) {
    if (!tenant.rent_due_date || !tenant.start_date) continue;

    const paymentRes = await Tenant.getPaymentsByTenantId(tenant.id);
    const rentPayments = paymentRes.filter(p => !p.receipt_number?.startsWith('SEC-DEP'));
    const totalPaid = rentPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

    const startDate = new Date(tenant.start_date);
    const anchorSrc = new Date(tenant.rent_due_date || tenant.start_date);

    // Use same formula as getDashboardData for consistency
    let monthsDiff = (today.getFullYear() - anchorSrc.getFullYear()) * 12
                   + (today.getMonth() - anchorSrc.getMonth());
    if (today.getDate() >= anchorSrc.getDate()) {
        monthsDiff += 1;
    }
    // Add 1 for move-in partial month only if startDate < anchorDate
    const hasInitialMonth = startDate < anchorSrc ? 1 : 0;
    const monthsElapsed = Math.max(1, monthsDiff + hasInitialMonth);

    const totalExpected = monthsElapsed * parseFloat(tenant.monthly_rent);
    const lateFees = _calculateLateFees(tenant, rentPayments, today);
    const rawBalanceDue = totalExpected - totalPaid + lateFees;
    
    // Apply a ₹1 threshold to ignore floating point rounding errors or tiny balances
    const balanceDue = rawBalanceDue > 1 ? Math.round(rawBalanceDue * 100) / 100 : 0;

    // Override the static 'payment_status' with our dynamic check
    tenant.status = balanceDue <= 0 ? 'PAID' : 'UNPAID';
    // Expose balance for landlord dashboard to show cumulative debt
    tenant.balance_due = balanceDue;
    tenant.months_overdue = balanceDue > 0 ? Math.ceil(balanceDue / parseFloat(tenant.monthly_rent)) : 0;
  }

  return tenants;
};

exports.getDashboardData = async (requesterId, targetUserName = null) => {
  let userId = requesterId;

  if (targetUserName) {
    const targetUser = await UserModel.findUserBySlug(targetUserName);
    if (!targetUser) throw new Error("Tenant not found");

    logger({ requesterId, targetUserId: targetUser.id, targetUserName }, "getDashboardData: PRE-ACCESS CHECK");

    // Allow if searching for self OR requester is ADMIN
    const isSelf = targetUser.id == requesterId;
    const requester = await UserModel.findUserById(requesterId);
    const isAdmin = requester?.role === 'ADMIN';

    logger({ isSelf, isAdmin }, "getDashboardData: ACCESS CHECK RESULTS");

    if (!isSelf && !isAdmin) {
      // Verify landlord handles this tenant
      const tenants = await Tenant.getByUserId(targetUser.id);
      const isManaged = tenants?.some(t => t.landlord_id == requesterId);
      logger(isManaged, "getDashboardData: IS MANAGED");
      if (!isManaged) {
        throw new Error(`Access denied: Requester ${requesterId} does not manage Target ${targetUser.id}`);
      }
    }
    userId = targetUser.id;
  }

  // 1️⃣ Get ALL tenant properties (returns array now)
  const tenants = await Tenant.getByUserId(userId);

  // 1.5 Get service requests (Global for user)
  const serviceRequests = await ServiceRequestModel.getByUser(userId);

  // 2️⃣ Get tenant user info
  const user = await UserModel.findUserById(userId);

  if (!tenants || tenants.length === 0) {
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
      familyMembers: 0,
      allProperties: []
    };
  }

  // Helper to process a single tenant property
  const processProperty = async (tenant) => {
    // 3️⃣ Get family members
    const members = await TenantMember.getByTenantId(tenant.id);

    // 4️⃣ Calculate Accumulated Rent (Rounding to fix precision)
    const payments = await Tenant.getPaymentsByTenantId(tenant.id);
    const totalPaid = Math.round(payments
      .filter(p => !p.receipt_number?.startsWith('SEC-DEP'))
      .reduce((sum, p) => sum + parseFloat(p.amount), 0) * 100) / 100;

    const currentDate = new Date();
    currentDate.setHours(12, 0, 0, 0); // IST Safe Today

    // Move-in date is the absolute floor for all cycles
    const startDateRaw = new Date(tenant.start_date);
    const startDateIST = new Date(startDateRaw.getTime() + (5.5 * 60 * 60 * 1000));
    const startDate = new Date(Date.UTC(startDateIST.getUTCFullYear(), startDateIST.getUTCMonth(), startDateIST.getUTCDate(), 12, 0, 0, 0));

    // Rent cycles are anchored to rent_due_date (which we now ensure is the cycle start day)
    const anchorDateSource = tenant.rent_due_date || tenant.start_date;
    const anchorDateRaw = new Date(anchorDateSource);
    const anchorDateIST = new Date(anchorDateRaw.getTime() + (5.5 * 60 * 60 * 1000));
    
    // Normalize anchorDate to have the same MONTH and YEAR as the move-in (start_date)
    // to ensure the cycle calculation starts from the very beginning.
    const anchorDate = new Date(Date.UTC(startDateIST.getUTCFullYear(), startDateIST.getUTCMonth(), anchorDateIST.getUTCDate(), 12, 0, 0, 0));

    // Calculate months elapsed
    let monthsElapsed = 0;
    if (getYMD(currentDate) >= getYMD(startDate)) {
        // If they have joined, they have at least 1 cycle started (the current one)
        let monthsDiff = (currentDate.getFullYear() - anchorDate.getFullYear()) * 12
                       + (currentDate.getMonth() - anchorDate.getMonth());
        
        // If today's day-of-month >= anchor's day-of-month, this cycle is definitely active.
        // We also check today >= startDate to ensure we catch the very first day properly.
        if (currentDate.getDate() >= anchorDate.getDate() || getYMD(currentDate) === getYMD(startDate)) {
            monthsDiff += 1;
        }
        
        // Standardize to at least 1 month if they are currently residing
        monthsElapsed = Math.max(1, monthsDiff);
    }

    const expectedRent = monthsElapsed * parseFloat(tenant.monthly_rent);
    const lateFees = _calculateLateFees(tenant, payments.filter(p => !p.receipt_number?.startsWith('SEC-DEP')), currentDate);
    const rawAccumulatedDue = expectedRent - totalPaid + lateFees;
    const accumulatedDue = rawAccumulatedDue > 1 ? Math.round(rawAccumulatedDue * 100) / 100 : 0;
    const unpaidMonthsCount = Math.max(0, Math.ceil((expectedRent - totalPaid) / parseFloat(tenant.monthly_rent)));

    // Calculate Next Due Date and Pending Months dynamically
    let nextDueDate = new Date(anchorDate);
    let nextDueDateDisplay = "";
    let nextDueDateSet = false;
    const pendingMonths = [];
    const pendingMonthsRanges = [];

    // Special Rule: If last_paid_month is empty, start due date MUST be rent_due_date
    const lastPaidMonth = tenant.last_paid_month ? new Date(tenant.last_paid_month) : null;
    
    const formatDateShort = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    // Scan ahead to find the next unpaid cycle
    for (let i = -1; i < 48; i++) {
        const cycleStart = new Date(anchorDate);
        cycleStart.setMonth(anchorDate.getMonth() + i);
        
        // Skip cycles preceding official move-in
        if (getYMD(cycleStart) < getYMD(startDate)) continue;

        const cycleEnd = new Date(cycleStart);
        cycleEnd.setMonth(cycleStart.getMonth() + 1);

        const cycleDateISO = getYMD(cycleStart);
        const isCyclePaid = payments
            .filter(p => !p.receipt_number?.startsWith('SEC-DEP'))
            .some(p => getYMD(p.due_date) === cycleDateISO);
        
        const isCoveredByLastPaid = lastPaidMonth && getYMD(cycleStart) <= getYMD(lastPaidMonth);

        const rangeStr = `${formatDateShort(cycleStart)} - ${formatDateShort(cycleEnd)}`;

        if (!isCyclePaid && !isCoveredByLastPaid) {
            if (!nextDueDateSet) {
               nextDueDate = cycleStart;
               nextDueDateDisplay = rangeStr;
               nextDueDateSet = true;
            }
            if (getYMD(cycleStart) <= getYMD(currentDate)) {
                pendingMonths.push(cycleStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }));
                pendingMonthsRanges.push(rangeStr);
            }
        }
        
        if (nextDueDateSet && getYMD(cycleStart) > getYMD(currentDate)) break;
    }

    // ✅ FIX: If ALL cycles are paid (nextDueDateSet === false),
    // find the very next upcoming cycle AFTER today so the display is correct.
    if (!nextDueDateSet) {
        for (let i = 0; i < 24; i++) {
            const cycleStart = new Date(anchorDate);
            cycleStart.setMonth(anchorDate.getMonth() + i);
            if (getYMD(cycleStart) > getYMD(currentDate)) {
                const cycleEnd = new Date(cycleStart);
                cycleEnd.setMonth(cycleStart.getMonth() + 1);
                nextDueDate = cycleStart;
                nextDueDateDisplay = `${formatDateShort(cycleStart)} - ${formatDateShort(cycleEnd)}`;
                break;
            }
        }
    }

    // Return merged response for this property
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
      late_fees: lateFees,
      unpaid_months_count: unpaidMonthsCount,
      pending_months: pendingMonths,
      pending_months_ranges: pendingMonthsRanges,
      months_elapsed: monthsElapsed,
      total_paid: totalPaid,
      next_due_date: nextDueDate, // New dynamic field
      next_due_date_display: nextDueDateDisplay,

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

  // Process all properties
  const allProperties = await Promise.all(tenants.map(processProperty));

  // Return the first property as "current" for backward compatibility
  // But include the full list for the frontend switcher
  return {
    ...allProperties[0],
    allProperties
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
