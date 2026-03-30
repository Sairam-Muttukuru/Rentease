const db = require("./Backend/src/config/db");
async function check() {
  try {
    const res = await db.query(`
      SELECT s.name, sc.name as category 
      FROM services s 
      JOIN service_types st ON s.type_id = st.id 
      JOIN service_categories sc ON st.category_id = sc.id 
      WHERE s.name ILIKE '%Water Lekage Repair%'
    `);
    console.table(res.rows);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
check();
