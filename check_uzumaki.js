const db = require("./Backend/src/config/db");
async function check() {
  try {
    const res = await db.query("SELECT company_name, service_type FROM service_providers WHERE company_name LIKE '%Uzumaki%'");
    console.table(res.rows);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
check();
