const express = require("express");

const router = express.Router();

const {
    addRating,
    getToolRatings,
    getMyRating
} = require("../controllers/ratingcontroller");

const authMiddleware = require("../middleware/authmiddleware");

// Submit a rating
router.post("/", authMiddleware, addRating);

// Get all ratings for a tool
router.get("/:toolId", getToolRatings);

// Get logged-in user's rating
router.get("/:toolId/my-rating", authMiddleware, getMyRating);

module.exports = router;