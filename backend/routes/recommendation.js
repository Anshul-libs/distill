const express = require("express");
const router = express.Router();

const {
    getRecommendations
} = require("../controllers/recommendationcontroller");

router.post("/", getRecommendations);

module.exports = router;