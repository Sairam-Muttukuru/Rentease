const db = require("../config/db");

async function run() {
    try {
        console.log("Cleaning up ghost tenants (tenants without primary members)...");
        
        // Find tenants who don't have a primary member in tenant_members
        const ghostTenants = await db.query(`
            SELECT t.id, t.property_id, p.title
            FROM tenants t
            LEFT JOIN tenant_members tm ON tm.tenant_id = t.id AND tm.is_primary = true
            JOIN properties p ON p.id = t.property_id
            WHERE tm.id IS NULL
        `);

        if (ghostTenants.rows.length === 0) {
            console.log("No ghost tenants found.");
            process.exit(0);
        }

        console.log(`Found ${ghostTenants.rows.length} ghost tenants. Deleting...`);
        
        for (const tenant of ghostTenants.rows) {
            console.log(`Deleting ghost tenant ${tenant.id} from property: ${tenant.title}`);
            // Delete secondary members if any (unlikely for ghosts)
            await db.query("DELETE FROM tenant_members WHERE tenant_id = $1", [tenant.id]);
            // Delete the tenant
            await db.query("DELETE FROM tenants WHERE id = $1", [tenant.id]);
        }

        console.log("SUCCESS: Ghost tenants cleaned up.");
        process.exit(0);
    } catch (error) {
        console.error("FAILURE: Error during cleanup:", error);
        process.exit(1);
    }
}

run();
