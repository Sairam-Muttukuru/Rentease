const db = require('./Backend/src/config/db');
let bcrypt;
try {
    bcrypt = require('./Backend/node_modules/bcryptjs');
} catch (e) {
    try {
        bcrypt = require('bcryptjs'); // Fallback
    } catch (e2) {
        console.error("❌ Cannot load bcryptjs from ./Backend/node_modules or global. Cannot create test admin.");
        process.exit(1);
    }
}

async function test() {
    const email = 'temp_test_admin_v2@rentease.com';
    const password = 'password123';

    try {
        console.log("1️⃣  Creating Temp Admin...");
        const hash = await bcrypt.hash(password, 10);
        const userRes = await db.query(
            "INSERT INTO users (first_name, last_name, email, password, role, status) VALUES ('Test', 'Admin', $1, $2, 'ADMIN', 'Active') RETURNING id",
            [email, hash]
        );
        const userId = userRes.rows[0].id;
        console.log(`✅ Created temp admin (ID: ${userId})`);

        console.log("2️⃣  Logging in...");
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status} ${loginRes.statusText}`);
        }
        const loginData = await loginRes.json();
        const token = loginData.accessToken;
        console.log('✅ Logged in, Got Token');

        console.log("3️⃣  Fetching Providers...");
        const provRes = await fetch('http://localhost:5000/api/admin/providers', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (provRes.ok) {
            const providers = await provRes.json();
            console.log(`✅ Fetched ${providers.length} providers successfully.`);
        } else {
            console.error(`❌ Failed to fetch providers: ${provRes.status} ${provRes.statusText}`);
            const errText = await provRes.text();
            console.error('Response:', errText);
        }

        // 4. Cleanup
        await db.query("DELETE FROM users WHERE id = $1", [userId]);
        console.log('🧹 Cleanup done.');

    } catch (err) {
        console.error('❌ Test failed:', err.message);
        // Cleanup
        await db.query("DELETE FROM users WHERE email = $1", [email]);
    } finally {
        process.exit();
    }
}

test();
