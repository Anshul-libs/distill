const {
    createRating,
    getRatingsByTool,
    getAverageRating,
    getUserRating
} = require("../models/ratingmodel");

const pool = require("../config/db");

// POST /api/ratings
const addRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { toolId, rating } = req.body;

        // Validate tool ID
        const numericToolId = Number(toolId);

        if (!Number.isInteger(numericToolId) || numericToolId <= 0) {
            return res.status(400).json({
                message: "Invalid tool ID"
            });
        }

        // Validate rating
        const numericRating = Number(rating);

        if (
            !Number.isInteger(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                message: "Rating must be an integer between 1 and 5"
            });
        }

        // Check whether the AI tool exists
        const toolResult = await pool.query(
            "SELECT id FROM ai_tools WHERE id = $1",
            [numericToolId]
        );

        if (toolResult.rows.length === 0) {
            return res.status(404).json({
                message: "AI tool not found"
            });
        }

        // Check whether user already rated this tool
        const existingRating = await getUserRating(
            userId,
            numericToolId
        );

        if (existingRating) {
            return res.status(409).json({
                message: "You have already rated this tool"
            });
        }

        // Create rating
        const newRating = await createRating(
            userId,
            numericToolId,
            numericRating
        );

        // Get updated average
        const average = await getAverageRating(numericToolId);

        return res.status(201).json({
            message: "Rating submitted successfully",
            rating: newRating,
            averageRating: Number(average.average_rating),
            totalRatings: Number(average.total_ratings)
        });

    } catch (error) {
        console.error("Add Rating Error:", error);

        // PostgreSQL unique constraint
        if (error.code === "23505") {
            return res.status(409).json({
                message: "You have already rated this tool"
            });
        }

        return res.status(500).json({
            message: "Server error while submitting rating"
        });
    }
};


// GET /api/ratings/:toolId
const getToolRatings = async (req, res) => {
    try {
        const toolId = Number(req.params.toolId);

        if (!Number.isInteger(toolId) || toolId <= 0) {
            return res.status(400).json({
                message: "Invalid tool ID"
            });
        }

        // Check whether tool exists
        const toolResult = await pool.query(
            "SELECT id FROM ai_tools WHERE id = $1",
            [toolId]
        );

        if (toolResult.rows.length === 0) {
            return res.status(404).json({
                message: "AI tool not found"
            });
        }

        const ratings = await getRatingsByTool(toolId);
        const average = await getAverageRating(toolId);

        return res.status(200).json({
            toolId,
            averageRating: Number(average.average_rating),
            totalRatings: Number(average.total_ratings),
            ratings
        });

    } catch (error) {
        console.error("Get Ratings Error:", error);

        return res.status(500).json({
            message: "Server error while fetching ratings"
        });
    }
};


// GET /api/ratings/:toolId/my-rating
const getMyRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const toolId = Number(req.params.toolId);

        if (!Number.isInteger(toolId) || toolId <= 0) {
            return res.status(400).json({
                message: "Invalid tool ID"
            });
        }

        const rating = await getUserRating(
            userId,
            toolId
        );

        return res.status(200).json({
            rating
        });

    } catch (error) {
        console.error("Get My Rating Error:", error);

        return res.status(500).json({
            message: "Server error while fetching your rating"
        });
    }
};


module.exports = {
    addRating,
    getToolRatings,
    getMyRating
};