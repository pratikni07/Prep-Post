const express = require("express");
const {
  getInterviewExperiences,
  getInterviewExperience,
  createInterviewExperience,
  updateInterviewExperience,
  deleteInterviewExperience,
  addComment,
  likeInterviewExperience,
} = require("../controllers/interviewExperienceController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(getInterviewExperiences)
  .post(protect, createInterviewExperience);

router
  .route("/:id")
  .get(getInterviewExperience)
  .put(protect, updateInterviewExperience)
  .delete(protect, deleteInterviewExperience);

router.route("/:id/comments").post(protect, addComment);

router.route("/:id/like").post(protect, likeInterviewExperience);

module.exports = router;
