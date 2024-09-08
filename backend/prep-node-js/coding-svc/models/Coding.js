const mongoose = require("mongoose");

const CodingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
      index: true,
    },
    topics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        index: true,
      },
    ],
    subTopics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubTopic",
        index: true,
      },
    ],
    companies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        index: true,
      },
    ],
    code: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    testCases: [
      {
        input: String,
        expectedOutput: String,
      },
    ],
    solutionCode: {
      type: String,
      required: true,
    },
    reportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    solvedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    successfulSubmissions: {
      type: Number,
      default: 0,
    },
    totalSubmissions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

CodingSchema.index({ title: "text", description: "text" });

const Coding = mongoose.model("Coding", CodingSchema);

module.exports = Coding;
