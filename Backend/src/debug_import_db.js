
const pool = require("./config/db");

pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("Query Error:", err);
    } else {
        console.log("Query Success:", res.rows[0]);
    }
    pool.end();
});
