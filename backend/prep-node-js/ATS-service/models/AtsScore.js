const mongoose = require("mongoose");

const AtsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resumeText: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  atsScore: {
    type: Number,
    required: true,
  },
  suggestions: {
    type: [String],
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AtsScore", AtsSchema);
