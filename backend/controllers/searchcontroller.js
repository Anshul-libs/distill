const searchModel = require("../models/searchmodel");

const searchTools = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const tools = await searchModel.searchTools(q.trim());

        res.json({
            success: true,
            count: tools.length,
            data: tools
        });

    } catch (error) {
        console.error("Search Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to search AI tools"
        });
    }
};

module.exports = {
    searchTools
};