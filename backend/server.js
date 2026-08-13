const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const toolRoutes = require("./routes/toolroutes");

const searchRoutes = require("./routes/searchroutes");
const recommendationRoutes = require("./routes/recommendation");

app.use(cors());
app.use(express.json());

app.use("/api/tools", toolRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/recommendations", recommendationRoutes);

// Connect to Neon PostgreSQL
require("./config/db");

app.get("/", (req, res) => {
    res.send("Distill Backend API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});