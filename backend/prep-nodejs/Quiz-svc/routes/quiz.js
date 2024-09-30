// quiz-service/routes/quiz.js
const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");

router.post("/create", async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      topic,
      subtopic,
      questions,
      type,
      startTime,
      endTime,
    } = req.body;
    const quiz = new Quiz({
      title,
      description,
      company,
      topic,
      subtopic,
      questions,
      type,
      startTime,
      endTime,
    });
    await quiz.save();
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ msg: "Quiz not found" });
    }
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/submit/:id", async (req, res) => {
  try {
    const { userId, answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ msg: "Quiz not found" });
    }
    const score = calculateScore(quiz.questions, answers);
    await Quiz.findByIdAndUpdate(req.params.id, {
      $push: { solvedBy: { user: userId, score } },
    });
    res.json({ score });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

function calculateScore(questions, answers) {
  let score = 0;
  questions.forEach((question, index) => {
    if (question.correctOption === answers[index]) {
      score++;
    }
  });
  return (score / questions.length) * 100;
}

module.exports = router;
