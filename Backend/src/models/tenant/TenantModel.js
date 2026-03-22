const db = require("../../config/db");

exports.create = async (data) => {
  console.log("Creating tenant with data:", data);
  return (await db.query(
    `INSERT INTO tenants
     (landlord_id, property_id, tenant_type, monthly_rent, payment_status, user_id, start_date, rent_due_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [data.landlord_id, data.property_id, data.tenant_type, data.monthly_rent, data.payment_status, data.user_id, data.start_date, data.rent_due_date]
  )).rows[0];
};

exports.getByPropertyId = async (propertyId) => {
  return (await db.query(
    "SELECT * FROM tenants WHERE property_id=$1",
    [propertyId]
  )).rows[0];
};

exports.getFullTenantByProperty = async (propertyId, landlordId) => {
  console.log("Fetching tenants for propertyId:", propertyId, "landlordId:", landlordId);
  return (await db.query(
    `
    SELECT t.id, t.user_id, t.property_id, t.monthly_rent, tm.full_name as name, tm.tenant_emailid as email, tm.phone
    FROM tenants t
    JOIN tenant_members tm ON tm.tenant_id = t.id
    WHERE t.property_id=$1 AND t.landlord_id=$2 AND tm.is_primary = true
    `,
    [propertyId, landlordId]
  )).rows;
};

exports.getAllByLandlordId = async (landlordId) => {
  return (await db.query(
    `
    SELECT 
    t.id,
    t.user_id,
    t.property_id,
    t.tenant_type,
    t.monthly_rent,
    t.payment_status as status,
    t.start_date,
    t.rent_due_date,
    p.title as property_name,
    p.late_penalty_amount as "latePenaltyAmount",
    p.rent_due_day as "rentDueDay",
    tm.full_name as name,
    tm.phone,
    tm.tenant_emailid as email,
    (SELECT COUNT(*) FROM tenant_members WHERE tenant_id = t.id) as members,
    u.avatar_url,
    COALESCE(
      (SELECT json_agg(pi.image_url)
       FROM property_images pi
       WHERE pi.property_id = p.id)
    , '[]') as property_images
    FROM tenants t
    JOIN properties p ON p.id = t.property_id
    JOIN users u ON u.id = t.user_id 
    LEFT JOIN tenant_members tm ON tm.tenant_id = t.id AND tm.is_primary = true
    WHERE t.landlord_id = $1
    `,
    [landlordId]
  )).rows;
};

exports.update = async (tenantId, landlordId, data) => {
  return (await db.query(
    `
    UPDATE tenants
    SET tenant_type = $1, monthly_rent = $2, payment_status = $3, start_date = $6, rent_due_date = $7
    WHERE id = $4 AND landlord_id = $5
  RETURNING *
    `,
    [
      data.tenant_type,
      data.monthly_rent,
      data.payment_status || 'UNPAID',
      tenantId,
      landlordId,
      data.start_date || null,
      data.rent_due_date || null
    ]
  )).rows[0];
};

exports.delete = async (tenantId, landlordId) => {
  // Delete all members first (explicit cascade)
  await db.query("DELETE FROM tenant_members WHERE tenant_id=$1", [tenantId]);
  // Then delete the tenant
  await db.query(
    "DELETE FROM tenants WHERE id=$1 AND landlord_id=$2",
    [tenantId, landlordId]
  );
};
exports.getById = async (tenantId) => {
  return (
    await db.query(
      "SELECT * FROM tenants WHERE id = $1",
      [tenantId]
    )
  ).rows[0];
};

exports.getByUserId = async (userId) => {
  return (await db.query(
    `
  SELECT
  t.rent_due_date,
    t.start_date,
    t.*,
    p.title as property_name,
    p.address,
    p.city,
    p.locality,
    p.price as property_rent,
    p.property_type,
    p.area_sqft,
    p.bedrooms,
    p.bathrooms,

    --Financials & Policies
  p.security_deposit as "securityDeposit",
    t.security_deposit_status as "securityDepositStatus",
    p.rent_escalation_desc as "rentEscalation",
    p.bank_account as "bankAccount",
    p.ifsc_code as "ifscCode",
    p.upi_id as "upiId",
    p.late_penalty_amount as "latePenaltyAmount",
    p.rent_due_day as "rentDueDay",
    p.guidelines,
    p.room_type,
    p.food_included,
    p.electricity_included,

    CONCAT(u.first_name, ' ', u.last_name) as landlord_name,
    u.email as landlord_email,
    u.avatar_url as landlord_avatar_url,
    CONCAT(tu.first_name, ' ', tu.last_name) as full_name, --Fetch tenant name
  COALESCE(
    (SELECT json_agg(pi.image_url)
         FROM property_images pi
         WHERE pi.property_id = p.id)
    , '[]') as images,
      COALESCE(
        (SELECT json_agg(a.name)
         FROM property_amenities pa
         JOIN amenities a ON a.id = pa.amenity_id
         WHERE pa.property_id = p.id)
      , '[]') as amenities
    FROM tenants t
    LEFT JOIN properties p ON p.id = t.property_id
    LEFT JOIN users u ON u.id = t.landlord_id
    LEFT JOIN users tu ON tu.id = t.user_id-- Join to get tenant details
    WHERE t.user_id = $1
    `,
    [userId]
  )).rows;
};

exports.getPaymentsByTenantId = async (tenantId) => {
  return (await db.query(`
  SELECT *
    FROM rent_payments 
    WHERE tenant_id = $1 
    ORDER BY payment_date DESC
    `, [tenantId])).rows;
};

exports.getDetailedById = async (tenantId) => {
  return (await db.query(
    `
    SELECT 
      t.id,
      t.user_id,
      t.property_id,
      t.landlord_id,
      p.title as property_name,
      p.address as property_address,
      tm.full_name as tenant_name,
      tm.tenant_emailid as tenant_email,
      CONCAT(lu.first_name, ' ', lu.last_name) as landlord_name
    FROM tenants t
    JOIN properties p ON p.id = t.property_id
    JOIN users lu ON lu.id = t.landlord_id
    LEFT JOIN tenant_members tm ON tm.tenant_id = t.id AND tm.is_primary = true
    WHERE t.id = $1
    `,
    [tenantId]
  )).rows[0];
};