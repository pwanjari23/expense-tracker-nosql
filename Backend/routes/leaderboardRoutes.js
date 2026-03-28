const express = require("express");
const router = express.Router();
const {
  getCategoryLeaderboard,
} = require("../controllers/leaderboardController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getCategoryLeaderboard);

module.exports = router;
