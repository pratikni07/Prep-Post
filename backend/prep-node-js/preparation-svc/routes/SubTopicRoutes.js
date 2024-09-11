// routes/subTopicRoutes.js
const express = require("express");
const router = express.Router();
const {
  createSubTopic,
  getSubTopics,
  getSubTopic,
  updateSubTopic,
  deleteSubTopic,
} = require("../controllers/SubTopicController");

// GET all subtopics
router.get("/", getSubTopics);

// GET a single subtopic
router.get("/:id", getSubTopic);

// POST a new subtopic
router.post("/", createSubTopic);

// PUT update a subtopic
router.put("/:id", updateSubTopic);

// DELETE a subtopic
router.delete("/:id", deleteSubTopic);

module.exports = router;
