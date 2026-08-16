const pool = require("../config/db");

// Create a rating
const createRating = async (userId, toolId, rating) => {
    const result = await pool.query(
        `
        INSERT INTO ratings (user_id, tool_id, rating)
        VALUES ($1, $2, $3)
        RETURNING id, user_id, tool_id, rating, created_at
        `,
        [userId, toolId, rating]
    );

    return result.rows[0];
};

// Get all ratings for a tool
const getRatingsByTool = async (toolId) => {
    const result = await pool.query(
        `
        SELECT
            id,
            user_id,
            tool_id,
            rating,
            created_at
        FROM ratings
        WHERE tool_id = $1
        ORDER BY created_at DESC
        `,
        [toolId]
    );

    return result.rows;
};

// Get average rating for a tool
const getAverageRating = async (toolId) => {
    const result = await pool.query(
        `
        SELECT
            COALESCE(ROUND(AVG(rating)::numeric, 1), 0) AS average_rating,
            COUNT(*)::integer AS total_ratings
        FROM ratings
        WHERE tool_id = $1
        `,
        [toolId]
    );

    return result.rows[0];
};

// Get a user's rating for a specific tool
const getUserRating = async (userId, toolId) => {
    const result = await pool.query(
        `
        SELECT
            id,
            user_id,
            tool_id,
            rating,
            created_at
        FROM ratings
        WHERE user_id = $1
        AND tool_id = $2
        `,
        [userId, toolId]
    );

    return result.rows[0] || null;
};

module.exports = {
    createRating,
    getRatingsByTool,
    getAverageRating,
    getUserRating
};