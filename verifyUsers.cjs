const db = require('./Backend/src/config/db');
let bcrypt;
try {
    bcrypt = require('./Backend/node_modules/bcryptjs');
} catch (e) {
    try { bcrypt = require('bcryptjs'); } catch (e2) { }
}

async function verifyUsers() {
    const email = 'debug_admin_users@rentease.com';
    const password = 'password123';

    try {
        if (!bcrypt) {
            console.error("❌ Bcrypt not found. Skipping auth test.");
            process.exit(1);
        }

        // 1. Create Temp Admin
        const hash = await bcrypt.hash(password, 10);
        const userRes = await db.query(
            "INSERT INTO users (first_name, last_name, email, password, role, status) VALUES ('Debug', 'Admin', $1, $2, 'ADMIN', 'Active') RETURNING id",
            [email, hash]
        );
        const userId = userRes.rows[0].id;
        console.log(`✅ Created temp admin (ID: ${userId})`);

        // 2. Login
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const { accessToken } = await loginRes.json();
        console.log("✅ Logged in.");

        // 3. Fetch Users
        const res = await fetch('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (res.ok) {
            const users = await res.json();
            console.log(`✅ Users fetched successfully. Count: ${users.length}`);
        } else {
            console.error(`❌ Users fetch failed: ${res.status} ${res.statusText}`);
            const text = await res.text();
            console.error("Response:", text);
        }

        // Cleanup
        await db.query("DELETE FROM users WHERE id=$1", [userId]);

    } catch (err) {
        console.error("❌ Test failed:", err.message);
        await db.query("DELETE FROM users WHERE email=$1", [email]);
    } finally {
        process.exit();
    }
}

verifyUsers();
