const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  language: {
    type: String,
    enum: ["cpp", "java", "python", "javascript"],
    required: true,
  },
  code: { type: String, required: true },
  status: {
    type: String,
    enum: [
      "Pending",
      "Accepted",
      "Wrong Answer",
      "Runtime Error",
      "Time Limit Exceeded",
    ],
    default: "Pending",
  },
  runtime: Number,
  memory: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Submission", SubmissionSchema);
