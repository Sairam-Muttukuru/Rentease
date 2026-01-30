const { Pool } = require('pg');
require('dotenv').config({ path: './src/.env' });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function debug() {
    try {
        const res = await pool.query(`
      SELECT pg_get_constraintdef(oid) as def
      FROM pg_constraint
      WHERE conname = 'tenants_tenant_type_check';
    `);

        if (res.rows.length > 0) {
            console.log("CONSTRAINT DEF:", res.rows[0].def);
        } else {
            console.log("Constraint not found");
        }

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

debug();
