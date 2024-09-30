// interview-experience-service/models/InterviewExperience.js
const mongoose = require("mongoose");

const InterviewExperienceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  content: { type: String, required: true },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      content: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  relatedTopics: [String],
  relatedQuestions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CodingProblem" },
  ],
  createdAt: { type: Date, default: Date.now },
});

InterviewExperienceSchema.index({
  company: "text",
  role: "text",
  content: "text",
});
InterviewExperienceSchema.index({ createdAt: -1 });

module.exports = mongoose.model(
  "InterviewExperience",
  InterviewExperienceSchema
);
