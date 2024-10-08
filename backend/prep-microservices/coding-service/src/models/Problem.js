const mongoose = require("mongoose");

const TestCaseSchema = new mongoose.Schema({
  input: String,
  expectedOutput: String,
});

const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  topic: { type: String, required: true },
  subtopic: String,
  sampleTestCases: [TestCaseSchema],
  testCases: [TestCaseSchema],
  solutionTemplate: {
    cpp: String,
    java: String,
    python: String,
    javascript: String,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Problem", ProblemSchema);
