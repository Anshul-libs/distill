const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const toolRoutes = require("./routes/toolroutes");

const searchRoutes = require("./routes/searchroutes");
const recommendationRoutes = require("./routes/recommendation");
const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authroutes");

app.use(cors());
app.use(express.json());

app.use("/api/tools", toolRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/recommendation", recommendationRoutes);
app.use("/api/chats", chatRoutes);
console.log("authRoutes type:", typeof authRoutes);
app.use("/api/auth", authRoutes);

// Connect to Neon PostgreSQL
require("./config/db");

app.get("/", (req, res) => {
    res.send("Distill Backend API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});