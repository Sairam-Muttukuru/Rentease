const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, 'src', '.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

async function checkData() {
    let output = '';
    try {
        const queries = {
            tenant_dates: `
                SELECT 
                t.id, 
                t.start_date,
                t.rent_due_date,
                p.title as property_name
                FROM tenants t
                JOIN properties p ON p.id = t.property_id
                LIMIT 5
            `
        };
        for (const [key, q] of Object.entries(queries)) {
            output += `--- Data for ${key} ---\n`;
            const res = await pool.query(q);
            output += JSON.stringify(res.rows, null, 2) + '\n\n';
        }
    } catch (err) {
        output += `Error: ${err.message}\n`;
    } finally {
        fs.writeFileSync('data_output.txt', output);
        await pool.end();
    }
}

checkData();
