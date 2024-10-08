const mongoose = require("mongoose");

const subtopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
  quizzes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
  ],
  codingProblems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CodingProblem",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Subtopic = mongoose.model("Subtopic", subtopicSchema);

module.exports = Subtopic;
