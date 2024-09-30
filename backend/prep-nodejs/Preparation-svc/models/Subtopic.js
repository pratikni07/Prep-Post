// preparation-service/models/Subtopic.js
const mongoose = require("mongoose");

const SubtopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "CodingProblem" }],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
  theory: String,
});

module.exports = mongoose.model("Subtopic", SubtopicSchema);
