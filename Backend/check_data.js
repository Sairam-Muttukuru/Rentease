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
            categories: "SELECT id, name, provider_id FROM service_categories",
            types: "SELECT id, category_id, name FROM service_types",
            sub_types: "SELECT id, type_id, name FROM service_sub_types",
            services: "SELECT id, sub_type_id, name, provider_id FROM services LIMIT 20"
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
