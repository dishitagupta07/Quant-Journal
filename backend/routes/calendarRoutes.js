const express = require("express");
const Trade = require("../models/Trade");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET CALENDAR DATA
router.get("/", authMiddleware, async (req, res) => {
    try {

        const trades = await Trade.find({
            user: req.user.id
        }).sort({
            tradeDate: 1
        });

        res.status(200).json(trades);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
});

module.exports = router;