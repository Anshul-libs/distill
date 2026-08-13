const pool = require("../config/db");

const getAllTools = async () => {
    const result = await pool.query(
        "SELECT * FROM ai_tools ORDER BY id DESC"
    );

    return result.rows;
};

const getToolById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM ai_tools WHERE id = $1",
        [id]
    );

    return result.rows[0];
};

module.exports = {
    getAllTools,
    getToolById
};