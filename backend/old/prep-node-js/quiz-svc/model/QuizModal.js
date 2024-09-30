const mongoose = require("mongoose");

const QuizSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  ],
  topic: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
    },
  ],
  subTopic: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubTopic",
    },
  ],
  solvedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  visibilty: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    enum: ["public", "private"],
  },
  crearedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

QuizSchema.plugin(mongoosePaginate);

// Add indexes for frequently queried fields
QuizSchema.index({ visibility: 1, type: 1 });
QuizSchema.index({ createdDate: -1 });

const Quiz = mongoose.model("Quiz", QuizSchema);

module.exports = Quiz;
