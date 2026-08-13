const pool = require("./config/db");

async function testDatabase() {
    try {
        const result = await pool.query("SELECT * FROM ai_tools LIMIT 5");

        console.log("✅ ai_tools table connected!");
        console.log("Number of tools:", result.rows.length);
        console.log(result.rows);
    } catch (error) {
        console.error("❌ Failed to read ai_tools:");
        console.error(error.message);
    } finally {
        await pool.end();
    }
}

testDatabase();