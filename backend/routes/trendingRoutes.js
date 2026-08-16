const express = require("express");
const router = express.Router();

const { getTrendingTools } = require("../controllers/trendingController");

router.get("/", getTrendingTools);

module.exports = router;