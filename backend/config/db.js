const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.connect()
    .then(() => {
        console.log("Neon database connected successfully");
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
    });

module.exports = pool;