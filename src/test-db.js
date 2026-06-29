const pool = require("./config/db");

async function testConnection() {
    try {
        const result = await pool.query("SELECT NOW()");
        console.log("Connexion OK :", result.rows[0]);
    } catch (err) {
        console.error("Erreur connexion :", err);
    }
}

testConnection();