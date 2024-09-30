// routes/quizRoutes.js
const express = require("express");
const router = express.Router();
const {
  createQuiz,
  getQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/QuizController");
const { protect } = require("../middleware/auth");

// Public routes
router.get("/", getQuizzes);
router.get("/:id", getQuiz);

// Protected routes
router.use(protect);
router.post("/", createQuiz);
router.put("/:id", updateQuiz);
router.delete("/:id", deleteQuiz);

module.exports = router;
