const Event = require("../models/eventModel");
const asyncHandler = require("express-async-handler");

exports.getUserEngagement = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const pipeline = [
    {
      $match: {
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: "$eventType",
        count: { $sum: 1 },
      },
    },
  ];

  const result = await Event.aggregate(pipeline);
  res.json(result);
});

exports.getPopularContent = asyncHandler(async (req, res) => {
  const { contentType, limit = 10 } = req.query;
  const pipeline = [
    {
      $match: {
        eventType:
          contentType === "quiz" ? "QUIZ_START" : "CODING_PROBLEM_START",
      },
    },
    {
      $group: {
        _id: "$metadata.contentId",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: parseInt(limit),
    },
  ];

  const result = await Event.aggregate(pipeline);
  res.json(result);
});

exports.getUserRetention = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const pipeline = [
    {
      $match: {
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          userId: "$userId",
          date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        },
      },
    },
    {
      $group: {
        _id: "$_id.date",
        uniqueUsers: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  const result = await Event.aggregate(pipeline);
  res.json(result);
});

exports.getRealTimeMetrics = asyncHandler(async (req, res) => {
  const activeUsers = await global.redisClient.get("activeUsers");
  const pageViews = await global.redisClient.get("pageViews");

  res.json({
    activeUsers: parseInt(activeUsers) || 0,
    pageViews: parseInt(pageViews) || 0,
  });
});
