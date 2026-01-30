const axios = require('axios');
const db = require('./Backend/src/config/db');
const bcrypt = require('bcryptjs');

async function test() {
    const email = 'temp_test_admin@rentease.com';
    const password = 'password123';

    try {
        // 1. Create Temp Admin
        const hash = await bcrypt.hash(password, 10);
        const userRes = await db.query(
            "INSERT INTO users (first_name, last_name, email, password, role, status) VALUES ('Test', 'Admin', $1, $2, 'ADMIN', 'Active') RETURNING id",
            [email, hash]
        );
        const userId = userRes.rows[0].id;
        console.log(`✅ Created temp admin (ID: ${userId})`);

        // 2. Login to get token
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email,
            password
        });
        const token = loginRes.data.accessToken;
        console.log('✅ Logged in, Got Token');

        // 3. Fetch Providers
        try {
            const provRes = await axios.get('http://localhost:5000/api/admin/providers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`✅ Fetched ${provRes.data.length} providers successfully.`);
        } catch (err) {
            console.error('❌ Failed to fetch providers:', err.response ? err.response.status : err.message);
            if (err.response) console.error('Response:', err.response.data);
        }

        // 4. Cleanup
        await db.query("DELETE FROM users WHERE id = $1", [userId]);
        console.log('🧹 Cleanup done.');

    } catch (err) {
        console.error('❌ Test failed:', err.message);
        if (err.response) console.error('Response:', err.response.data);
        // Cleanup if feasible
        await db.query("DELETE FROM users WHERE email = $1", [email]);
    } finally {
        process.exit();
    }
}

test();
