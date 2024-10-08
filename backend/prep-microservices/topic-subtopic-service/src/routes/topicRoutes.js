const express = require("express");
const {
  getTopics,
  getTopic,
  createTopic,
  updateTopic,
  deleteTopic,
} = require("../controllers/topicController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getTopics).post(protect, admin, createTopic);

router
  .route("/:id")
  .get(getTopic)
  .put(protect, admin, updateTopic)
  .delete(protect, admin, deleteTopic);

module.exports = router;
