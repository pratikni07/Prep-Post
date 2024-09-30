// coding-service/models/CodingProblem.js
const mongoose = require("mongoose");

const CodingProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  sampleCode: String,
  testCases: [
    {
      input: String,
      expectedOutput: String,
    },
  ],
  solvedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  topic: String,
  subtopic: String,
  solutions: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      code: String,
    },
  ],
});

CodingProblemSchema.index({ title: "text", description: "text" });
CodingProblemSchema.index({ topic: 1, subtopic: 1 });

module.exports = mongoose.model("CodingProblem", CodingProblemSchema);
