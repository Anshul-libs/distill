const toolModel = require("../models/toolmodel");

const getTools = async (req, res) => {
    try {
        const tools = await toolModel.getAllTools();

        res.json({
            success: true,
            data: tools
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch AI tools"
        });
    }
};

const getTool = async (req, res) => {
    try {
        const tool = await toolModel.getToolById(req.params.id);

        if (!tool) {
            return res.status(404).json({
                success: false,
                message: "AI tool not found"
            });
        }

        res.json({
            success: true,
            data: tool
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch AI tool"
        });
    }
};

module.exports = {
    getTools,
    getTool
};