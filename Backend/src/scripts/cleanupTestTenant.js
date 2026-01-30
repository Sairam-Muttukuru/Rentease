
const db = require('../config/db');
require('dotenv').config({ path: 'src/.env' });

async function cleanup() {
    try {
        const email = 'bhavanimuttukuru@gmail.com';
        // Find tenant ID
        const tRes = await db.query(
            `SELECT t.id FROM tenants t 
       JOIN tenant_members tm ON tm.tenant_id = t.id 
       WHERE tm.tenant_emailid = $1`,
            [email]
        );

        if (tRes.rows.length > 0) {
            const tenantId = tRes.rows[0].id;
            console.log(`Deleting test tenant ID: ${tenantId}`);
            // Delete members
            await db.query("DELETE FROM tenant_members WHERE tenant_id = $1", [tenantId]);
            // Delete tenant
            await db.query("DELETE FROM tenants WHERE id = $1", [tenantId]);
            console.log("✅ Cleanup successful.");
        } else {
            console.log("No test tenant found to cleanup.");
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

cleanup();
