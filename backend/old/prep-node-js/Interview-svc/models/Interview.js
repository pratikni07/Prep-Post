const mongoose = require("mongoose");

const InterviewSchema = new mongoose.Schema({
  jobDescription: String,
  questions: [
    {
      text: String,
      answer: String,
      score: Number,
    },
  ],
  feedback: String,
  performanceReport: {
    overallScore: Number,
    strengths: [String],
    areasForImprovement: [String],
    recommendations: [String],
  },
  userId: mongoose.Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Interview", InterviewSchema);
