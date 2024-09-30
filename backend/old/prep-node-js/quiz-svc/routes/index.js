// routes/index.js
const express = require("express");
const router = express.Router();
const topicRoutes = require("./topicRoutes");
const subTopicRoutes = require("./subTopicRoutes");
const quizRoutes = require("./quizRoutes");
const questionRoutes = require("./questionRoutes");

// Use topic routes
router.use("/topics", topicRoutes);

// Use subtopic routes
router.use("/subtopics", subTopicRoutes);

// Use quiz routes
router.use("/quizzes", quizRoutes);

// Use question routes
router.use("/questions", questionRoutes);

module.exports = router;
