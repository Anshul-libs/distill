const express = require("express");
const router = express.Router();

const {
    getTools,
    getTool
} = require("../controllers/toolcontroller");

router.get("/", getTools);
router.get("/:id", getTool);

module.exports = router;