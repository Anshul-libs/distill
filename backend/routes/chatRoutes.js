const express = require("express");

const router = express.Router();

const {
    createChat,
    addMessage,
    getMessages,
    sendChatMessage
} = require("../controllers/chatController");

// Create new chat
router.post("/", createChat);

// Send message + get recommendation
router.post("/message", sendChatMessage);

// Save message separately
router.post("/messages", addMessage);

// Get chat messages
router.get("/:chatId/messages", getMessages);

module.exports = router;