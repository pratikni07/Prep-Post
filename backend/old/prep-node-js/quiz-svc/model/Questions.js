const mongoose = require("mongoose");

const QuestionSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
  },
  subTopic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubTopic",
  },
  question: {
    type: String,
    required: true,
  },

  options: [
    {
      type: Array,
      required: true,
    },
  ],
  answer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  // if user create this question at time of creating quiz then add quiz
  type: {
    type: String,
    enum: ["quiz", "free"],
    default: "free",
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Question = mongoose.model("Question", QuestionSchema);
