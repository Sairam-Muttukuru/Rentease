const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// Try a few possible paths for .env
const envPaths = [
    path.join(__dirname, 'src', '.env'),
    path.join(__dirname, '.env'),
    path.join(__dirname, '..', '.env')
];

let envPath = envPaths.find(p => fs.existsSync(p));

require('dotenv').config({ path: envPath });

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
        const table = 'properties';
        output += `--- Schema for ${table} ---\n`;
        const res = await pool.query(`
            SELECT column_name, data_type, character_maximum_length, is_nullable
            FROM information_schema.columns
            WHERE table_name = $1
            ORDER BY ordinal_position
        `, [table]);
        output += JSON.stringify(res.rows, null, 2) + '\n\n';
    } catch (err) {
        output += `Error: ${err.message}\n`;
    } finally {
        fs.writeFileSync('properties_schema.txt', output);
        await pool.end();
    }
}

inspect();
