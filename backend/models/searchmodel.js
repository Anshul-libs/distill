const pool = require("../config/db");

const searchTools = async (searchTerm) => {
    const result = await pool.query(
        `
        SELECT *
        FROM ai_tools
        WHERE
            tool_name ILIKE $1
            OR category ILIKE $1
            OR subcategory ILIKE $1
            OR description ILIKE $1
            OR target_users::text ILIKE $1
            OR best_use_cases::text ILIKE $1
        ORDER BY id DESC
        `,
        [`%${searchTerm}%`]
    );

    return result.rows;
};

module.exports = {
    searchTools
};