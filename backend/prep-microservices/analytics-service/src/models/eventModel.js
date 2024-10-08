const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      "PAGE_VIEW",
      "QUIZ_START",
      "QUIZ_COMPLETE",
      "CODING_PROBLEM_START",
      "CODING_PROBLEM_SUBMIT",
      "INTERVIEW_EXPERIENCE_VIEW",
      "INTERVIEW_EXPERIENCE_LIKE",
    ],
  },
  metadata: {
    type: Map,
    of: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
