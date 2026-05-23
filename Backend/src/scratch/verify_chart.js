const db = require('../config/db');

async function check() {
    try {
        const query = `
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
          AND service_payment_status = 'PAID'
        GROUP BY 1
    )
    SELECT m.month, 
           m.month_start,
           COALESCE(rs.rent, 0) as rent, 
           rs.month_start as rent_month_start,
           COALESCE(ss.service, 0) as service,
           ss.month_start as service_month_start
    FROM months m
    LEFT JOIN rent_stats rs ON m.month_start = rs.month_start
    LEFT JOIN service_stats ss ON m.month_start = ss.month_start
    ORDER BY m.month_start ASC
        `;
        const res = await db.query(query);
        console.log("Revenue Chart Data:", JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
