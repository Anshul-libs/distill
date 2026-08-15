const pool = require("../config/db");

const createChat = async (userId, title) => {
    const result = await pool.query(
        `INSERT INTO chats (user_id, title)
         VALUES ($1, $2)
         RETURNING *`,
        [userId || null, title]
    );

    return result.rows[0];
};

const createMessage = async (chatId, role, content) => {
    const result = await pool.query(
        `INSERT INTO messages (chat_id, role, content)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [chatId, role, content]
    );

    return result.rows[0];
};

const getChatMessages = async (chatId) => {
    const result = await pool.query(
        `SELECT *
         FROM messages
         WHERE chat_id = $1
         ORDER BY created_at ASC`,
        [chatId]
    );

    return result.rows;
};

module.exports = {
    createChat,
    createMessage,
    getChatMessages
};