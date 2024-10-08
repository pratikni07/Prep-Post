const express = require("express");
const {
  getSubtopics,
  getSubtopic,
  createSubtopic,
  updateSubtopic,
  deleteSubtopic,
} = require("../controllers/subtopicController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getSubtopics).post(protect, admin, createSubtopic);

router
  .route("/:id")
  .get(getSubtopic)
  .put(protect, admin, updateSubtopic)
  .delete(protect, admin, deleteSubtopic);

module.exports = router;
