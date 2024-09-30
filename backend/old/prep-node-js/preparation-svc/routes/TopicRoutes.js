// routes/topicRoutes.js
const express = require("express");
const router = express.Router();
const {
  createTopic,
  getTopics,
  getTopic,
  updateTopic,
  deleteTopic,
} = require("../controllers/TopicController");

// GET all topics
router.get("/", getTopics);

// GET a single topic
router.get("/:id", getTopic);

// POST a new topic
router.post("/", createTopic);

// PUT update a topic
router.put("/:id", updateTopic);

// DELETE a topic
router.delete("/:id", deleteTopic);

module.exports = router;
