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

async function inspect() {
    let output = '';
    try {
        const tables = ['service_types', 'service_sub_types', 'services'];
        for (const table of tables) {
            output += `--- Schema for ${table} ---\n`;
            const res = await pool.query(`
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = $1
                ORDER BY ordinal_position
            `, [table]);
            output += JSON.stringify(res.rows, null, 2) + '\n\n';
        }
    } catch (err) {
        output += `Error: ${err.message}\n`;
    } finally {
        fs.writeFileSync('schema_output.txt', output);
        await pool.end();
    }
}

inspect();
