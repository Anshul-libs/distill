const {
    createHistory,
    getHistory,
    deleteHistory
} = require("../models/historyModel");

// Save history
const saveHistory = async (req, res) => {
    try {
        const { profession, task, recommendation } = req.body;
        const userId = req.user.id;

        if (!profession || !task || !recommendation) {
            return res.status(400).json({
                message: "Profession, task and recommendation are required"
            });
        }

        const history = await createHistory(
            userId,
            profession,
            task,
            recommendation
        );

        res.status(201).json({
            message: "History saved successfully",
            history
        });

    } catch (error) {
        console.error("Save history error:", error.message);

        res.status(500).json({
            message: "Failed to save history"
        });
    }
};


// Get only latest 10 history records
const fetchHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const history = await getHistory(userId);

        res.status(200).json({
            history
        });

    } catch (error) {
        console.error("Get history error:", error.message);

        res.status(500).json({
            message: "Failed to fetch history"
        });
    }
};


// Delete history
const removeHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const historyId = parseInt(req.params.id);

        if (isNaN(historyId)) {
            return res.status(400).json({
                message: "Invalid history ID"
            });
        }

        const deletedHistory = await deleteHistory(
            userId,
            historyId
        );

        if (!deletedHistory) {
            return res.status(404).json({
                message: "History not found"
            });
        }

        res.status(200).json({
            message: "History deleted successfully"
        });

    } catch (error) {
        console.error("Delete history error:", error.message);

        res.status(500).json({
            message: "Failed to delete history"
        });
    }
};


module.exports = {
    saveHistory,
    fetchHistory,
    removeHistory
};