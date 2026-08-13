const express = require("express");
const router = express.Router();

const { searchTools } = require("../controllers/searchcontroller");

router.get("/", searchTools);

module.exports = router;