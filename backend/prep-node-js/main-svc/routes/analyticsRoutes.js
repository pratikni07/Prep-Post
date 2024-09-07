const express = require("express");
const AnalyticsController = require("../controllers/analyticsController");

const router = express.Router();
const analyticsController = new AnalyticsController();

router.post(
  "/visit",
  analyticsController.recordVisit.bind(analyticsController)
);
router.post(
  "/new-user",
  analyticsController.recordNewUser.bind(analyticsController)
);
router.get(
  "/daily",
  analyticsController.getDailyAnalytics.bind(analyticsController)
);
router.get(
  "/page-views",
  analyticsController.getPageViewAnalytics.bind(analyticsController)
);
router.get(
  "/retention-rate",
  analyticsController.getUserRetentionRate.bind(analyticsController)
);
router.get(
  "/top-content",
  analyticsController.getTopPerformingContent.bind(analyticsController)
);

module.exports = router;
