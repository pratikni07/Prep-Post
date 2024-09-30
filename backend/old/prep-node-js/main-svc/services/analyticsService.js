// File: src/services/analyticsService.js

const { Redis } = require("ioredis");
const { Kafka } = require("kafkajs");
const AnalyticsModel = require("../models/Analysis");

class AnalyticsService {
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
    this.kafka = new Kafka({
      clientId: "analytics-service",
      brokers: [process.env.KAFKA_BROKER],
    });
    this.producer = this.kafka.producer();
    this.producer.connect();
  }

  async recordVisit(userId, pageUrl) {
    const date = new Date().toISOString().split("T")[0];
    await this.redis.hincrby(`analytics:${date}`, "visits", 1);
    await this.redis.hincrby(`analytics:${date}:pages`, pageUrl, 1);

    if (userId) {
      await this.redis.sadd(`analytics:${date}:users`, userId);
    }

    await this.producer.send({
      topic: "user-activity",
      messages: [
        {
          value: JSON.stringify({
            type: "visit",
            userId,
            pageUrl,
            timestamp: Date.now(),
          }),
        },
      ],
    });
  }

  async recordNewUser(userId) {
    const date = new Date().toISOString().split("T")[0];
    await this.redis.hincrby(`analytics:${date}`, "newUsers", 1);

    // Publish event to Kafka
    await this.producer.send({
      topic: "user-activity",
      messages: [
        {
          value: JSON.stringify({
            type: "new-user",
            userId,
            timestamp: Date.now(),
          }),
        },
      ],
    });
  }

  async getDailyAnalytics(date) {
    const [visits, newUsers, uniqueUsers] = await Promise.all([
      this.redis.hget(`analytics:${date}`, "visits"),
      this.redis.hget(`analytics:${date}`, "newUsers"),
      this.redis.scard(`analytics:${date}:users`),
    ]);

    return {
      date,
      visits: parseInt(visits) || 0,
      newUsers: parseInt(newUsers) || 0,
      uniqueUsers: uniqueUsers || 0,
    };
  }

  async getPageViewAnalytics(startDate, endDate) {
    const pageViews = {};
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const dailyPageViews = await this.redis.hgetall(
        `analytics:${dateStr}:pages`
      );

      for (const [page, views] of Object.entries(dailyPageViews)) {
        pageViews[page] = (pageViews[page] || 0) + parseInt(views);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return pageViews;
  }

  async getUserRetentionRate(startDate, endDate) {
    const startUsers = await this.redis.scard(`analytics:${startDate}:users`);
    const endUsers = await this.redis.scard(`analytics:${endDate}:users`);
    const retainedUsers = await this.redis.sinter(
      `analytics:${startDate}:users`,
      `analytics:${endDate}:users`
    );

    return {
      startDate,
      endDate,
      retentionRate: retainedUsers.length / startUsers,
      startUsers,
      endUsers,
      retainedUsers: retainedUsers.length,
    };
  }

  async getTopPerformingContent(startDate, endDate, limit) {
    const aggregatedViews = {};
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const dailyPageViews = await this.redis.hgetall(
        `analytics:${dateStr}:pages`
      );

      for (const [page, views] of Object.entries(dailyPageViews)) {
        aggregatedViews[page] = (aggregatedViews[page] || 0) + parseInt(views);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return Object.entries(aggregatedViews)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([page, views]) => ({ page, views }));
  }
}

module.exports = AnalyticsService;
