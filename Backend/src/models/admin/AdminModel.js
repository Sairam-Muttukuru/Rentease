const db = require("../../config/db");

exports.countUsers = async () =>
  (await db.query("SELECT COUNT(*)::integer FROM users")).rows[0].count;

exports.countProperties = async () =>
  (await db.query("SELECT COUNT(*)::integer FROM properties")).rows[0].count;

exports.countOccupied = async () =>
  (await db.query("SELECT COUNT(DISTINCT property_id)::integer FROM tenants")).rows[0].count;

exports.countOpenComplaints = async () =>
  (await db.query("SELECT COUNT(*)::integer FROM complaints WHERE status!='Resolved'")).rows[0].count;

exports.getMonthlyRevenue = async () => {
  const rent = (await db.query("SELECT COALESCE(SUM(amount),0)::integer FROM rent_payments WHERE date_trunc('month', payment_date)=date_trunc('month', CURRENT_DATE)")).rows[0].coalesce;
  const service = (await db.query("SELECT COALESCE(SUM(amount),0)::integer FROM service_requests WHERE date_trunc('month', created_at)=date_trunc('month', CURRENT_DATE) AND status='Paid'")).rows[0].coalesce;
  return Number(rent) + Number(service);
};

exports.revenueChart = async () =>
  (await db.query(`
    WITH months AS (
        SELECT to_char(m, 'Mon') as month,
               EXTRACT(MONTH FROM m) as month_num,
               date_trunc('month', m) as month_start
        FROM generate_series(
            date_trunc('month', current_date - interval '5 months'),
            date_trunc('month', current_date),
            interval '1 month'
        ) m
    ),
    rent_stats AS (
        SELECT date_trunc('month', payment_date) as month_start,
               SUM(amount)::integer as rent
        FROM rent_payments
        WHERE payment_date > current_date - interval '6 months'
        GROUP BY 1
    ),
    service_stats AS (
        SELECT date_trunc('month', created_at) as month_start,
               SUM(amount)::integer as service
        FROM service_requests
        WHERE created_at > current_date - interval '6 months'
          AND status = 'Paid'
        GROUP BY 1
    )
    SELECT m.month, 
           COALESCE(rs.rent, 0) as rent, 
           COALESCE(ss.service, 0) as service
    FROM months m
    LEFT JOIN rent_stats rs ON m.month_start = rs.month_start
    LEFT JOIN service_stats ss ON m.month_start = ss.month_start
    ORDER BY m.month_start ASC
  `)).rows;

exports.complaintChart = async () =>
  (await db.query(`
    SELECT s.status as name, COALESCE(COUNT(c.id), 0)::integer as value
    FROM (SELECT unnest(ARRAY['Open', 'In Progress', 'Resolved']) as status) s
    LEFT JOIN complaints c ON c.status = s.status
    GROUP BY s.status
  `)).rows;

exports.recentActivity = async () =>
  (await db.query(`
    SELECT l.action, l.created_at as timestamp, 
           u.first_name || ' ' || u.last_name as performed_by
    FROM admin_audit_logs l
    LEFT JOIN users u ON l.admin_id = u.id
    ORDER BY l.created_at DESC LIMIT 5
  `)).rows;

exports.userGrowthChart = async () =>
  (await db.query(`
    WITH months AS (
        SELECT to_char(m, 'Mon') as name,
               EXTRACT(MONTH FROM m) as month_num,
               date_trunc('month', m) as month_start
        FROM generate_series(
            date_trunc('month', current_date - interval '5 months'),
            date_trunc('month', current_date),
            interval '1 month'
        ) m
    ),
    user_stats AS (
        SELECT date_trunc('month', created_at) as month_start,
               COUNT(*)::integer as value
        FROM users
        WHERE created_at > current_date - interval '6 months'
        GROUP BY 1
    )
    SELECT m.name, 
           COALESCE(us.value, 0) as value,
           0 as prev
    FROM months m
    LEFT JOIN user_stats us ON m.month_start = us.month_start
    ORDER BY m.month_start ASC
  `)).rows;

exports.getUsers = async (adminId) =>
  (await db.query("SELECT * FROM users WHERE id != $1", [adminId])).rows;

exports.toggleUserStatus = async (id) =>
  db.query(`UPDATE users SET status = CASE WHEN status='Active' THEN 'Blocked' ELSE 'Active' END WHERE id=$1`, [id]);

exports.getProperties = async () =>
  (await db.query(`
    SELECT p.*, u.first_name, u.last_name, u.email as landlord_email,
    COALESCE(
        (SELECT json_agg(json_build_object('url', pi.image_url, 'is_cover', pi.is_cover))
        FROM property_images pi
        WHERE pi.property_id = p.id),
        '[]'
    ) as images
    FROM properties p
    LEFT JOIN users u ON p.landlord_id = u.id
    ORDER BY p.id DESC
  `)).rows;

exports.togglePropertyStatus = async (id) =>
  db.query(`UPDATE properties SET status = CASE WHEN status='Suspended' THEN 'Available' ELSE 'Suspended' END WHERE id=$1`, [id]);

exports.getComplaints = async () =>
  (await db.query(`
    SELECT c.*, 
           p.title as property_title, 
           p.address as property_address,
           p.city as property_city,
           p.locality as property_locality,
           p.price as property_price,
           p.property_type,
           p.area_sqft,
           COALESCE(
             (SELECT json_agg(json_build_object('url', pi.image_url, 'is_cover', pi.is_cover))
              FROM property_images pi
              WHERE pi.property_id = p.id),
             '[]'
           ) as property_images,
           u.first_name as landlord_first_name,
           u.last_name as landlord_last_name,
           u.email as landlord_email
    FROM complaints c
    LEFT JOIN properties p ON c.property_id = p.id
    LEFT JOIN users u ON p.landlord_id = u.id
    ORDER BY c.created_at DESC
  `)).rows;

exports.resolveComplaint = async (id) =>
  db.query(`UPDATE complaints SET status = 'Resolved' WHERE id = $1`, [id]);

exports.convertComplaint = async (id, priority) =>
  db.query(`INSERT INTO service_requests(complaint_id, priority, status) VALUES($1, $2, 'Pending')`, [id, priority]);

exports.getProviders = async () =>
  (await db.query(`
    SELECT sp.*, u.first_name, u.last_name, u.email,
  (SELECT COUNT(*) FROM service_requests sr WHERE sr.assigned_provider_id = sp.id AND sr.status = 'Assigned') as active_jobs_count
    FROM service_providers sp
    JOIN users u ON sp.user_id = u.id
    ORDER BY sp.id DESC
  `)).rows;

exports.createUser = async (email, password, firstName, lastName) =>
  (await db.query(
    `INSERT INTO users(first_name, last_name, email, password, role, status) VALUES($1, $2, $3, $4, 'SERVICE_PROVIDER', 'Active') RETURNING * `,
    [firstName, lastName, email, password]
  )).rows[0];

exports.createProvider = async (userId, data) =>
  (await db.query(
    `INSERT INTO service_providers(user_id, company_name, service_type, service_area, phone, status)
VALUES($1, $2, $3, $4, $5, 'Active') RETURNING * `,
    [userId, data.company_name, data.service_type, data.service_area, data.phone]
  )).rows[0];

exports.findUserByEmail = async (email) =>
  (await db.query("SELECT * FROM users WHERE email = $1", [email])).rows[0];

exports.checkProviderExists = async (userId) =>
  (await db.query("SELECT * FROM service_providers WHERE user_id = $1", [userId])).rows[0];

exports.toggleProviderStatus = async (id) =>
  db.query(`UPDATE service_providers SET status = CASE WHEN status = 'Active' THEN 'Suspended' ELSE 'Active' END WHERE id = $1`, [id]);

exports.getPayments = async () =>
  (await db.query("SELECT * FROM rent_payments ORDER BY payment_date DESC")).rows;

exports.getLogs = async () =>
  (await db.query(`
    SELECT l.id, l.action, l.created_at as timestamp,
  u.first_name || ' ' || u.last_name as performed_by
    FROM admin_audit_logs l
    LEFT JOIN users u ON l.admin_id = u.id
    ORDER BY l.created_at DESC
  `)).rows;

exports.getServiceTrackerJobs = async () =>
  (await db.query(`
    SELECT sr.*, 
           u.first_name || ' ' || u.last_name as tenant,
           sp.company_name as provider
    FROM service_requests sr
    LEFT JOIN users u ON sr.user_id = u.id
    LEFT JOIN service_providers sp ON sr.assigned_provider_id = sp.id
    WHERE sr.status IN ('Pending', 'Dispatched', 'In Progress', 'Assigned')
    ORDER BY sr.created_at DESC
  `)).rows;

exports.getServiceTrackerStats = async () => {
  const active = (await db.query("SELECT COUNT(*)::integer FROM service_requests WHERE status IN ('In Progress', 'Dispatched', 'Assigned')")).rows[0].count;
  const pending = (await db.query("SELECT COUNT(*)::integer FROM service_requests WHERE status = 'Pending'")).rows[0].count;
  const completed = (await db.query("SELECT COUNT(*)::integer FROM service_requests WHERE status = 'Completed' AND created_at::date = CURRENT_DATE")).rows[0].count;
  return { active, pending, completed };
};

exports.logAction = async (userId, action) => {
  try {
    await db.query(`
      INSERT INTO admin_audit_logs(admin_id, action, created_at)
VALUES($1, $2, NOW())
  `, [userId, action]);
  } catch (err) {
    console.error("❌ Failed to log admin action:", err.message);
    // Don't throw, just log error so main action succeeds
  }
};
