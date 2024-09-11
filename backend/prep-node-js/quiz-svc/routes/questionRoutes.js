// routes/questionRoutes.js
const express = require("express");
const router = express.Router();
const {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/QuestionController");
const { protect } = require("../middleware/auth");

// Public routes
router.get("/", getQuestions);
router.get("/:id", getQuestion);

// Protected routes
router.use(protect);
router.post("/", createQuestion);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

module.exports = router;
