const db = require("../../config/db");

exports.create = async (data) => {
  await db.query(
    `
    INSERT INTO tenant_members
    (tenant_id, full_name, phone, relation, is_primary, tenant_emailid, lease_start, lease_end, rent_amount, rent_due_day)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    `,
    [data.tenant_id, data.full_name, data.phone, data.relation, data.is_primary, data.tenant_emailid, data.lease_start, data.lease_end, data.rent_amount, data.rent_due_day]
  );
};

exports.getByTenantId = async (tenantId) => {
  return (
    await db.query(
      "SELECT * FROM tenant_members WHERE tenant_id = $1 ORDER BY is_primary DESC",
      [tenantId]
    )
  ).rows;
};

exports.getById = async (id) => {
  return (
    await db.query(
      `
      SELECT tm.*, t.landlord_id
      FROM tenant_members tm
      JOIN tenants t ON t.id = tm.tenant_id
      WHERE tm.id = $1
      `,
      [id]
    )
  ).rows[0];
};

// exports.update = async (id, data) => {
//   return (
//     await db.query(
//       `
//       UPDATE tenant_members
//       SET full_name=$1, phone=$2, relation=$3
//       WHERE id=$4
//       RETURNING *
//       `,
//       [data.full_name, data.phone, data.relation, id]
//     )
//   ).rows[0];
// };

exports.delete = async (id) => {
  await db.query("DELETE FROM tenant_members WHERE id=$1", [id]);
};

exports.update = async (memberId, data) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (data.full_name) { fields.push(`full_name=$${idx++}`); values.push(data.full_name); }
  if (data.phone) { fields.push(`phone=$${idx++}`); values.push(data.phone); }
  if (data.email) { fields.push(`tenant_emailid=$${idx++}`); values.push(data.email); }
  if (data.relation) { fields.push(`relation=$${idx++}`); values.push(data.relation); }

  if (fields.length === 0) return null;

  values.push(memberId);
  return (await db.query(
    `UPDATE tenant_members SET ${fields.join(', ')} WHERE id=$${idx} RETURNING *`,
    values
  )).rows[0];
};

exports.updatePrimaryByTenantId = async (tenantId, data) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (data.full_name) { fields.push(`full_name=$${idx++}`); values.push(data.full_name); }
  if (data.phone) { fields.push(`phone=$${idx++}`); values.push(data.phone); }
  if (data.email) { fields.push(`tenant_emailid=$${idx++}`); values.push(data.email); }
  if (data.relation) { fields.push(`relation=$${idx++}`); values.push(data.relation); }

  if (fields.length === 0) return null;

  values.push(tenantId);
  return (await db.query(
    `UPDATE tenant_members SET ${fields.join(', ')} WHERE tenant_id=$${idx} AND is_primary=true RETURNING *`,
    values
  )).rows[0];
};
