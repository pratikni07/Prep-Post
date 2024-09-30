// quiz-service/models/Quiz.js
const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  topic: { type: String, required: true },
  subtopic: String,
  questions: [
    {
      question: String,
      options: [String],
      correctOption: Number,
    },
  ],
  solvedBy: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      score: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  visibility: { type: Boolean, default: true },
  type: { type: String, enum: ["free", "lock"], default: "free" },
  startTime: Date,
  endTime: Date,
});

module.exports = mongoose.model("Quiz", QuizSchema);
