const pool = require("../config/db");

// Save a user's search history and recommendation
const createHistory = async (
    userId,
    profession,
    task,
    recommendation
) => {
    const result = await pool.query(
        `INSERT INTO search_history
         (user_id, profession, task, recommendation)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userId, profession, task, recommendation]
    );

    return result.rows[0];
};

// Get only the latest 10 history records
const getHistory = async (userId) => {
    const result = await pool.query(
        `SELECT *
         FROM search_history
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 10`,
        [userId]
    );

    return result.rows;
};

// Delete a history record
const deleteHistory = async (userId, historyId) => {
    const result = await pool.query(
        `DELETE FROM search_history
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [historyId, userId]
    );

    return result.rows[0];
};

module.exports = {
    createHistory,
    getHistory,
    deleteHistory
};