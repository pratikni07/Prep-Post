const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  scores: [
    {
      jobDescription: String,
      score: Number,
      date: { type: Date, default: Date.now },
    },
  ],
});

ResumeSchema.index({ user: 1 });

module.exports = mongoose.model("Resume", ResumeSchema);
