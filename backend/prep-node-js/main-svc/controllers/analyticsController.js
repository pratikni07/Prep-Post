// File: src/controllers/analyticsController.js

const AnalyticsService = require("../services/analyticsService");
const { validateDate } = require("../utils/validators");

class AnalyticsController {
  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  async recordVisit(req, res) {
    try {
      const { userId, pageUrl } = req.body;
      await this.analyticsService.recordVisit(userId, pageUrl);
      res.status(200).json({ message: "Visit recorded successfully" });
    } catch (error) {
      console.error("Error recording visit:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async recordNewUser(req, res) {
    try {
      const { userId } = req.body;
      await this.analyticsService.recordNewUser(userId);
      res.status(200).json({ message: "New user recorded successfully" });
    } catch (error) {
      console.error("Error recording new user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getDailyAnalytics(req, res) {
    try {
      const { date } = req.query;
      if (!validateDate(date)) {
        return res
          .status(400)
          .json({ error: "Invalid date format. Use YYYY-MM-DD." });
      }
      const analytics = await this.analyticsService.getDailyAnalytics(date);
      res.status(200).json(analytics);
    } catch (error) {
      console.error("Error fetching daily analytics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getPageViewAnalytics(req, res) {
    try {
      const { startDate, endDate } = req.query;
      if (!validateDate(startDate) || !validateDate(endDate)) {
        return res
          .status(400)
          .json({ error: "Invalid date format. Use YYYY-MM-DD." });
      }
      const analytics = await this.analyticsService.getPageViewAnalytics(
        startDate,
        endDate
      );
      res.status(200).json(analytics);
    } catch (error) {
      console.error("Error fetching page view analytics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getUserRetentionRate(req, res) {
    try {
      const { startDate, endDate } = req.query;
      if (!validateDate(startDate) || !validateDate(endDate)) {
        return res
          .status(400)
          .json({ error: "Invalid date format. Use YYYY-MM-DD." });
      }
      const retentionRate = await this.analyticsService.getUserRetentionRate(
        startDate,
        endDate
      );
      res.status(200).json({ retentionRate });
    } catch (error) {
      console.error("Error calculating user retention rate:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getTopPerformingContent(req, res) {
    try {
      const { startDate, endDate, limit = 10 } = req.query;
      if (!validateDate(startDate) || !validateDate(endDate)) {
        return res
          .status(400)
          .json({ error: "Invalid date format. Use YYYY-MM-DD." });
      }
      const topContent = await this.analyticsService.getTopPerformingContent(
        startDate,
        endDate,
        limit
      );
      res.status(200).json(topContent);
    } catch (error) {
      console.error("Error fetching top performing content:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = AnalyticsController;
