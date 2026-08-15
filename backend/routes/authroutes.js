const express = require("express");

const router = express.Router();

const {
    signup,
    login,
    getProfile
} = require("../controllers/authcontroller");

const authMiddleware = require("../middleware/authmiddleware");

router.post("/signup", signup);
router.post("/login", login);

router.get("/protected", authMiddleware, (req, res) => {
    res.json({
        message: "Protected route accessed successfully",
        user: req.user
    });
});

router.get("/profile", authMiddleware, getProfile);

module.exports = router;