const express = require("express");
const {
  getUserEngagement,
  getPopularContent,
  getUserRetention,
  getRealTimeMetrics,
} = require("../controllers/analyticsController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/user-engagement", protect, admin, getUserEngagement);
router.get("/popular-content", protect, admin, getPopularContent);
router.get("/user-retention", protect, admin, getUserRetention);
router.get("/real-time-metrics", protect, admin, getRealTimeMetrics);

module.exports = router;
